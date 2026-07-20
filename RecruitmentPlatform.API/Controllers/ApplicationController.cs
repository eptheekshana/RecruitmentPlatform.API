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
[Authorize]
public class ApplicationController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly MatchingService _matchingService;
    private readonly AuditLogService _auditLogService;

    public ApplicationController(
        ApplicationDbContext context,
        MatchingService matchingService,
        AuditLogService auditLogService)
    {
        _context = context;
        _matchingService = matchingService;
        _auditLogService = auditLogService;
    }

    /// <summary>
    /// Submit a job application (Candidates only).
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Candidate")]
    public async Task<ActionResult<ApplicationResponseDto>> Apply([FromBody] CreateApplicationDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var candidate = await _context.Candidates
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (candidate == null)
        {
            return BadRequest(new { message = "Candidate profile not found. Please complete your profile first." });
        }

        var job = await _context.JobPostings.FindAsync(dto.JobId);
        if (job == null || !job.IsActive)
        {
            return NotFound(new { message = "Job posting is unavailable or inactive." });
        }

        bool existingApplication = await _context.Applications
            .AnyAsync(a => a.CandidateId == candidate.CandidateId && a.JobId == dto.JobId);

        if (existingApplication)
        {
            return BadRequest(new { message = "You have already applied for this job posting." });
        }

        // Calculate AI Score using MatchingService
        decimal aiScore = await _matchingService.CalculateMatchScoreAsync(candidate, job);

        var application = new Application
        {
            CandidateId = candidate.CandidateId,
            JobId = dto.JobId,
            CoverLetter = dto.CoverLetter,
            Status = "Applied",
            AIScore = aiScore,
            AppliedDate = DateTime.UtcNow
        };

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();

        await _auditLogService.LogAsync("Job Application Submitted", $"Candidate '{candidate.User?.Email}' applied for '{job.Title}'", userId);

        return CreatedAtAction(nameof(GetApplicationById), new { id = application.ApplicationId }, new ApplicationResponseDto
        {
            ApplicationId = application.ApplicationId,
            Status = application.Status,
            AIScore = application.AIScore,
            AppliedDate = application.AppliedDate,
            CoverLetter = application.CoverLetter,
            CandidateId = candidate.CandidateId,
            CandidateName = $"{candidate.User?.FirstName} {candidate.User?.LastName}",
            CandidateEmail = candidate.User?.Email ?? string.Empty,
            JobId = job.JobId,
            JobTitle = job.Title
        });
    }

    /// <summary>
    /// Get applications list. Candidates see their own; Recruiters/Admins see all applications.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApplicationResponseDto>>> GetApplications([FromQuery] int? jobId = null)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        var query = _context.Applications
            .Include(a => a.Candidate).ThenInclude(c => c!.User)
            .Include(a => a.JobPosting)
            .AsQueryable();

        // Candidates can only view their own applications
        if (userRole == "Candidate")
        {
            query = query.Where(a => a.Candidate != null && a.Candidate.UserId == userId);
        }

        if (jobId.HasValue)
        {
            query = query.Where(a => a.JobId == jobId.Value);
        }

        var applications = await query
            .OrderByDescending(a => a.AppliedDate)
            .Select(a => new ApplicationResponseDto
            {
                ApplicationId = a.ApplicationId,
                Status = a.Status,
                AIScore = a.AIScore,
                AppliedDate = a.AppliedDate,
                CoverLetter = a.CoverLetter,
                CandidateId = a.CandidateId,
                CandidateName = a.Candidate != null && a.Candidate.User != null ? $"{a.Candidate.User.FirstName} {a.Candidate.User.LastName}" : "Candidate",
                CandidateEmail = a.Candidate != null && a.Candidate.User != null ? a.Candidate.User.Email : string.Empty,
                JobId = a.JobId,
                JobTitle = a.JobPosting != null ? a.JobPosting.Title : "Job"
            })
            .ToListAsync();

        return Ok(applications);
    }

    /// <summary>
    /// Get single application details by ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApplicationResponseDto>> GetApplicationById(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        var a = await _context.Applications
            .Include(a => a.Candidate).ThenInclude(c => c!.User)
            .Include(a => a.JobPosting)
            .FirstOrDefaultAsync(a => a.ApplicationId == id);

        if (a == null)
        {
            return NotFound(new { message = "Application not found." });
        }

        // Authorization check: Candidate must own application unless Recruiter/Admin
        if (userRole == "Candidate" && (a.Candidate == null || a.Candidate.UserId != userId))
        {
            return Forbid();
        }

        return Ok(new ApplicationResponseDto
        {
            ApplicationId = a.ApplicationId,
            Status = a.Status,
            AIScore = a.AIScore,
            AppliedDate = a.AppliedDate,
            CoverLetter = a.CoverLetter,
            CandidateId = a.CandidateId,
            CandidateName = a.Candidate != null && a.Candidate.User != null ? $"{a.Candidate.User.FirstName} {a.Candidate.User.LastName}" : "Candidate",
            CandidateEmail = a.Candidate != null && a.Candidate.User != null ? a.Candidate.User.Email : string.Empty,
            JobId = a.JobId,
            JobTitle = a.JobPosting != null ? a.JobPosting.Title : "Job"
        });
    }

    /// <summary>
    /// Update status of a job application (Recruiters or Admins only).
    /// </summary>
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<ActionResult<ApplicationResponseDto>> UpdateApplicationStatus(int id, [FromBody] UpdateApplicationStatusDto dto)
    {
        var a = await _context.Applications
            .Include(a => a.Candidate).ThenInclude(c => c!.User)
            .Include(a => a.JobPosting)
            .FirstOrDefaultAsync(a => a.ApplicationId == id);

        if (a == null)
        {
            return NotFound(new { message = "Application not found." });
        }

        a.Status = dto.Status;
        await _context.SaveChangesAsync();

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int.TryParse(userIdClaim, out int userId);
        await _auditLogService.LogAsync("Application Status Updated", $"Application ID {id} status set to '{dto.Status}'", userId);

        return Ok(new ApplicationResponseDto
        {
            ApplicationId = a.ApplicationId,
            Status = a.Status,
            AIScore = a.AIScore,
            AppliedDate = a.AppliedDate,
            CoverLetter = a.CoverLetter,
            CandidateId = a.CandidateId,
            CandidateName = a.Candidate != null && a.Candidate.User != null ? $"{a.Candidate.User.FirstName} {a.Candidate.User.LastName}" : "Candidate",
            CandidateEmail = a.Candidate != null && a.Candidate.User != null ? a.Candidate.User.Email : string.Empty,
            JobId = a.JobId,
            JobTitle = a.JobPosting != null ? a.JobPosting.Title : "Job"
        });
    }
}
