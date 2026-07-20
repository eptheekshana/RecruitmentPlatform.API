// Manages users, roles, audit logs, and system analytics.

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentPlatform.API.Data;
using RecruitmentPlatform.API.DTOs;
using RecruitmentPlatform.API.Entities;
using RecruitmentPlatform.API.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RecruitmentPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly AuditLogService _auditLogService;

    public AdminController(ApplicationDbContext context, AuditLogService auditLogService)
    {
        _context = context;
        _auditLogService = auditLogService;
    }

    /// <summary>
    /// List all platform users with organizational details.
    /// </summary>
    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<AdminUserResponseDto>>> GetUsers()
    {
        var users = await _context.Users
            .Include(u => u.Organization)
            .OrderBy(u => u.UserId)
            .Select(u => new AdminUserResponseDto
            {
                UserId = u.UserId,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Role = u.Role,
                OrganizationId = u.OrganizationId,
                OrganizationName = u.Organization != null ? u.Organization.Name : "N/A"
            })
            .ToListAsync();

        return Ok(users);
    }

    /// <summary>
    /// Update a user's role.
    /// </summary>
    [HttpPut("users/{id}/role")]
    public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateUserRoleDto dto)
    {
        var currentAdminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int.TryParse(currentAdminIdClaim, out int currentAdminId);

        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        var allowedRoles = new[] { "Candidate", "Recruiter", "HiringManager", "Admin" };
        if (!allowedRoles.Contains(dto.Role))
        {
            return BadRequest(new { message = $"Invalid role selection. Must be one of: {string.Join(", ", allowedRoles)}" });
        }

        // Prevent admin from removing their own admin role
        if (id == currentAdminId && !dto.Role.Equals("Admin", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "You cannot modify your own administrative user role." });
        }

        var oldRole = user.Role;
        user.Role = dto.Role;

        // If changed to Candidate, ensure candidate profile entity exists
        if (dto.Role.Equals("Candidate", StringComparison.OrdinalIgnoreCase))
        {
            var exists = await _context.Candidates.AnyAsync(c => c.UserId == id);
            if (!exists)
            {
                var candidate = new Candidate
                {
                    UserId = id,
                    Skills = string.Empty,
                    Bio = string.Empty,
                    ResumeUrl = string.Empty,
                    ExperienceLevel = "Entry"
                };
                _context.Candidates.Add(candidate);
            }
        }

        await _context.SaveChangesAsync();

        await _auditLogService.LogAsync(
            "User Role Updated", 
            $"Role of user '{user.Email}' changed from '{oldRole}' to '{dto.Role}' by Admin", 
            currentAdminId
        );

        return Ok(new { message = $"User role updated successfully to '{dto.Role}'." });
    }

    /// <summary>
    /// Delete user account.
    /// </summary>
    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var currentAdminIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int.TryParse(currentAdminIdClaim, out int currentAdminId);

        if (id == currentAdminId)
        {
            return BadRequest(new { message = "You cannot delete your own administrative account." });
        }

        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        await _auditLogService.LogAsync(
            "User Deleted", 
            $"User account of '{user.Email}' was removed by Admin", 
            currentAdminId
        );

        return Ok(new { message = "User deleted successfully." });
    }

    /// <summary>
    /// Retrieve system audit activity logs with optional log search/filtering.
    /// </summary>
    [HttpGet("logs")]
    public async Task<ActionResult<IEnumerable<AuditLogResponseDto>>> GetAuditLogs([FromQuery] string? query = null)
    {
        var dbQuery = _context.AuditLogs
            .Include(l => l.User)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query))
        {
            var q = query.ToLower();
            dbQuery = dbQuery.Where(l => l.Action.ToLower().Contains(q) || 
                                         l.Details.ToLower().Contains(q) ||
                                         (l.User != null && l.User.Email.ToLower().Contains(q)));
        }

        var logs = await dbQuery
            .OrderByDescending(l => l.Timestamp)
            .Select(l => new AuditLogResponseDto
            {
                AuditLogId = l.AuditLogId,
                Action = l.Action,
                Details = l.Details,
                Timestamp = l.Timestamp,
                UserEmail = l.User != null ? l.User.Email : "System"
            })
            .ToListAsync();

        return Ok(logs);
    }

    /// <summary>
    /// Retrieve structural metrics and aggregate KPI statistics for administration panel.
    /// </summary>
    [HttpGet("analytics")]
    public async Task<ActionResult<AnalyticsDashboardDto>> GetAnalytics()
    {
        var totalApplications = await _context.Applications.CountAsync();
        var totalJobPostings = await _context.JobPostings.CountAsync();
        var totalCandidates = await _context.Candidates.CountAsync();
        var totalUsers = await _context.Users.CountAsync();

        decimal averageMatchRate = 0;
        if (totalApplications > 0)
        {
            var scores = await _context.Applications.Select(a => a.AIScore).ToListAsync();
            averageMatchRate = scores.Any() ? Math.Round(scores.Average(), 1) : 0;
        }

        // Applications breakdown by status
        var appBreakdown = await _context.Applications
            .GroupBy(a => a.Status)
            .Select(g => new StatusCountDto
            {
                Status = g.Key,
                Count = g.Count()
            })
            .ToListAsync();

        // Jobs postings breakdown by department
        var departmentBreakdown = await _context.JobPostings
            .GroupBy(j => j.Department)
            .Select(g => new DepartmentCountDto
            {
                Department = string.IsNullOrWhiteSpace(g.Key) ? "Other" : g.Key,
                Count = g.Count()
            })
            .ToListAsync();

        // Recent 5 security logs
        var recentLogs = await _context.AuditLogs
            .Include(l => l.User)
            .OrderByDescending(l => l.Timestamp)
            .Take(5)
            .Select(l => new AuditLogResponseDto
            {
                AuditLogId = l.AuditLogId,
                Action = l.Action,
                Details = l.Details,
                Timestamp = l.Timestamp,
                UserEmail = l.User != null ? l.User.Email : "System"
            })
            .ToListAsync();

        return Ok(new AnalyticsDashboardDto
        {
            TotalApplications = totalApplications,
            TotalJobPostings = totalJobPostings,
            TotalCandidates = totalCandidates,
            TotalUsers = totalUsers,
            AverageAIScore = averageMatchRate,
            ApplicationsByStatus = appBreakdown,
            JobsByDepartment = departmentBreakdown,
            RecentLogs = recentLogs
        });
    }
}
