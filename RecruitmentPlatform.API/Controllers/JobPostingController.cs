using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentPlatform.API.Data;
using RecruitmentPlatform.API.DTOs;
using RecruitmentPlatform.API.Entities;
using RecruitmentPlatform.API.Services;
using System.Security.Claims;

namespace RecruitmentPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobPostingController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly AuditLogService _auditLogService;

    public JobPostingController(ApplicationDbContext context, AuditLogService auditLogService)
    {
        _context = context;
        _auditLogService = auditLogService;
    }

    /// <summary>
    /// Get list of active job postings (Public/All Roles).
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<JobPostingResponseDto>>> GetJobPostings([FromQuery] bool includeInactive = false)
    {
        var query = _context.JobPostings.Include(j => j.Recruiter).AsQueryable();

        if (!includeInactive)
        {
            query = query.Where(j => j.IsActive);
        }

        var jobs = await query
            .OrderByDescending(j => j.PostedDate)
            .Select(j => new JobPostingResponseDto
            {
                JobId = j.JobId,
                Title = j.Title,
                Description = j.Description,
                Requirements = j.Requirements,
                Department = j.Department,
                Location = j.Location,
                IsActive = j.IsActive,
                PostedDate = j.PostedDate,
                RecruiterId = j.RecruiterId,
                RecruiterName = j.Recruiter != null ? $"{j.Recruiter.FirstName} {j.Recruiter.LastName}" : "HR Team"
            })
            .ToListAsync();

        return Ok(jobs);
    }

    /// <summary>
    /// Get single job posting details by ID.
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<JobPostingResponseDto>> GetJobPosting(int id)
    {
        var j = await _context.JobPostings
            .Include(j => j.Recruiter)
            .FirstOrDefaultAsync(j => j.JobId == id);

        if (j == null)
        {
            return NotFound(new { message = "Job posting not found." });
        }

        return Ok(new JobPostingResponseDto
        {
            JobId = j.JobId,
            Title = j.Title,
            Description = j.Description,
            Requirements = j.Requirements,
            Department = j.Department,
            Location = j.Location,
            IsActive = j.IsActive,
            PostedDate = j.PostedDate,
            RecruiterId = j.RecruiterId,
            RecruiterName = j.Recruiter != null ? $"{j.Recruiter.FirstName} {j.Recruiter.LastName}" : "HR Team"
        });
    }

    /// <summary>
    /// Create a new job posting (Recruiter or Admin only).
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<ActionResult<JobPostingResponseDto>> CreateJobPosting([FromBody] CreateJobPostingDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int recruiterId))
        {
            return Unauthorized();
        }

        var job = new JobPosting
        {
            Title = dto.Title,
            Description = dto.Description,
            Requirements = dto.Requirements,
            Department = dto.Department,
            Location = dto.Location,
            IsActive = true,
            PostedDate = DateTime.UtcNow,
            RecruiterId = recruiterId
        };

        _context.JobPostings.Add(job);
        await _context.SaveChangesAsync();

        await _auditLogService.LogAsync("Job Posted", $"Created job posting: '{job.Title}' (ID: {job.JobId})", recruiterId);

        return CreatedAtAction(nameof(GetJobPosting), new { id = job.JobId }, new JobPostingResponseDto
        {
            JobId = job.JobId,
            Title = job.Title,
            Description = job.Description,
            Requirements = job.Requirements,
            Department = job.Department,
            Location = job.Location,
            IsActive = job.IsActive,
            PostedDate = job.PostedDate,
            RecruiterId = job.RecruiterId,
            RecruiterName = User.Identity?.Name ?? "Recruiter"
        });
    }

    /// <summary>
    /// Update an existing job posting (Recruiter or Admin only).
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<ActionResult<JobPostingResponseDto>> UpdateJobPosting(int id, [FromBody] UpdateJobPostingDto dto)
    {
        var job = await _context.JobPostings.FindAsync(id);
        if (job == null)
        {
            return NotFound(new { message = "Job posting not found." });
        }

        job.Title = dto.Title;
        job.Description = dto.Description;
        job.Requirements = dto.Requirements;
        job.Department = dto.Department;
        job.Location = dto.Location;
        job.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int.TryParse(userIdClaim, out int userId);
        await _auditLogService.LogAsync("Job Updated", $"Updated job posting: '{job.Title}' (ID: {job.JobId})", userId);

        return Ok(new JobPostingResponseDto
        {
            JobId = job.JobId,
            Title = job.Title,
            Description = job.Description,
            Requirements = job.Requirements,
            Department = job.Department,
            Location = job.Location,
            IsActive = job.IsActive,
            PostedDate = job.PostedDate,
            RecruiterId = job.RecruiterId
        });
    }

    /// <summary>
    /// Deactivate/Delete a job posting (Recruiter or Admin only).
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<IActionResult> DeleteJobPosting(int id)
    {
        var job = await _context.JobPostings.FindAsync(id);
        if (job == null)
        {
            return NotFound(new { message = "Job posting not found." });
        }

        _context.JobPostings.Remove(job);
        await _context.SaveChangesAsync();

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int.TryParse(userIdClaim, out int userId);
        await _auditLogService.LogAsync("Job Deleted", $"Deleted job posting: ID {id}", userId);

        return NoContent();
    }
}
