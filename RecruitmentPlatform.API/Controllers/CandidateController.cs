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
public class CandidateController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly AuditLogService _auditLogService;

    public CandidateController(ApplicationDbContext context, AuditLogService auditLogService)
    {
        _context = context;
        _auditLogService = auditLogService;
    }

    /// <summary>
    /// Get authenticated candidate's profile details.
    /// </summary>
    [HttpGet("me")]
    [Authorize(Roles = "Candidate")]
    public async Task<ActionResult<CandidateResponseDto>> GetMyProfile()
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
            return NotFound(new { message = "Candidate profile not found." });
        }

        return Ok(new CandidateResponseDto
        {
            CandidateId = candidate.CandidateId,
            UserId = candidate.UserId,
            FirstName = candidate.User?.FirstName ?? string.Empty,
            LastName = candidate.User?.LastName ?? string.Empty,
            Email = candidate.User?.Email ?? string.Empty,
            ResumeUrl = candidate.ResumeUrl,
            Skills = candidate.Skills,
            Bio = candidate.Bio,
            ExperienceLevel = candidate.ExperienceLevel
        });
    }

    /// <summary>
    /// Update candidate profile (Skills, Resume URL, Bio, Experience level).
    /// </summary>
    [HttpPut("me")]
    [Authorize(Roles = "Candidate")]
    public async Task<ActionResult<CandidateResponseDto>> UpdateMyProfile([FromBody] UpdateCandidateProfileDto dto)
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
            // If profile record doesn't exist yet, create it dynamically
            candidate = new Candidate { UserId = userId };
            _context.Candidates.Add(candidate);
        }

        candidate.ResumeUrl = dto.ResumeUrl;
        candidate.Skills = dto.Skills;
        candidate.Bio = dto.Bio;
        candidate.ExperienceLevel = dto.ExperienceLevel;

        await _context.SaveChangesAsync();

        await _auditLogService.LogAsync("Candidate Profile Updated", $"User ID {userId} updated candidate profile", userId);

        return Ok(new CandidateResponseDto
        {
            CandidateId = candidate.CandidateId,
            UserId = candidate.UserId,
            FirstName = candidate.User?.FirstName ?? string.Empty,
            LastName = candidate.User?.LastName ?? string.Empty,
            Email = candidate.User?.Email ?? string.Empty,
            ResumeUrl = candidate.ResumeUrl,
            Skills = candidate.Skills,
            Bio = candidate.Bio,
            ExperienceLevel = candidate.ExperienceLevel
        });
    }

    /// <summary>
    /// List all candidates (Recruiter or Admin only).
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<ActionResult<IEnumerable<CandidateResponseDto>>> GetAllCandidates()
    {
        var candidates = await _context.Candidates
            .Include(c => c.User)
            .Select(c => new CandidateResponseDto
            {
                CandidateId = c.CandidateId,
                UserId = c.UserId,
                FirstName = c.User != null ? c.User.FirstName : string.Empty,
                LastName = c.User != null ? c.User.LastName : string.Empty,
                Email = c.User != null ? c.User.Email : string.Empty,
                ResumeUrl = c.ResumeUrl,
                Skills = c.Skills,
                Bio = c.Bio,
                ExperienceLevel = c.ExperienceLevel
            })
            .ToListAsync();

        return Ok(candidates);
    }

    /// <summary>
    /// Get single candidate details by Candidate ID (Recruiter or Admin only).
    /// </summary>
    [HttpGet("{id}")]
    [Authorize(Roles = "Recruiter,Admin,HiringManager")]
    public async Task<ActionResult<CandidateResponseDto>> GetCandidateById(int id)
    {
        var c = await _context.Candidates
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.CandidateId == id);

        if (c == null)
        {
            return NotFound(new { message = "Candidate not found." });
        }

        return Ok(new CandidateResponseDto
        {
            CandidateId = c.CandidateId,
            UserId = c.UserId,
            FirstName = c.User != null ? c.User.FirstName : string.Empty,
            LastName = c.User != null ? c.User.LastName : string.Empty,
            Email = c.User != null ? c.User.Email : string.Empty,
            ResumeUrl = c.ResumeUrl,
            Skills = c.Skills,
            Bio = c.Bio,
            ExperienceLevel = c.ExperienceLevel
        });
    }
}
