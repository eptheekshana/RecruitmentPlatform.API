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
public class InterviewController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly AuditLogService _auditLogService;

    public InterviewController(ApplicationDbContext context, AuditLogService auditLogService)
    {
        _context = context;
        _auditLogService = auditLogService;
    }

    /// <summary>
    /// Schedule a new interview for an application (Recruiter or Admin only).
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<ActionResult<InterviewResponseDto>> ScheduleInterview([FromBody] CreateInterviewDto dto)
    {
        var application = await _context.Applications
            .Include(a => a.JobPosting)
            .Include(a => a.Candidate).ThenInclude(c => c!.User)
            .FirstOrDefaultAsync(a => a.ApplicationId == dto.ApplicationId);

        if (application == null)
        {
            return NotFound(new { message = "Application not found." });
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int.TryParse(userIdClaim, out int currentUserId);

        int interviewerId = dto.InterviewerId ?? currentUserId;

        var interview = new InterviewSchedule
        {
            ApplicationId = dto.ApplicationId,
            ScheduledTime = dto.ScheduledTime,
            MeetingLink = dto.MeetingLink,
            InterviewType = dto.InterviewType,
            Status = "Scheduled",
            InterviewerId = interviewerId
        };

        _context.InterviewSchedules.Add(interview);
        await _context.SaveChangesAsync();

        await _auditLogService.LogAsync("Interview Scheduled", $"Scheduled interview for Application ID {dto.ApplicationId} at {dto.ScheduledTime}", currentUserId);

        var interviewerUser = await _context.Users.FindAsync(interviewerId);

        return Ok(new InterviewResponseDto
        {
            InterviewId = interview.InterviewId,
            ScheduledTime = interview.ScheduledTime,
            MeetingLink = interview.MeetingLink,
            InterviewType = interview.InterviewType,
            Status = interview.Status,
            ApplicationId = application.ApplicationId,
            JobTitle = application.JobPosting?.Title ?? "Job",
            CandidateName = application.Candidate?.User != null ? $"{application.Candidate.User.FirstName} {application.Candidate.User.LastName}" : "Candidate",
            InterviewerId = interviewerId,
            InterviewerName = interviewerUser != null ? $"{interviewerUser.FirstName} {interviewerUser.LastName}" : "Interviewer"
        });
    }

    /// <summary>
    /// Get interviews list (Candidates see their own scheduled interviews; Recruiters/Admins see all).
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<InterviewResponseDto>>> GetInterviews()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        var query = _context.InterviewSchedules
            .Include(i => i.Application).ThenInclude(a => a!.JobPosting)
            .Include(i => i.Application).ThenInclude(a => a!.Candidate).ThenInclude(c => c!.User)
            .Include(i => i.Interviewer)
            .AsQueryable();

        if (userRole == "Candidate")
        {
            query = query.Where(i => i.Application != null && i.Application.Candidate != null && i.Application.Candidate.UserId == userId);
        }

        var interviews = await query
            .OrderBy(i => i.ScheduledTime)
            .Select(i => new InterviewResponseDto
            {
                InterviewId = i.InterviewId,
                ScheduledTime = i.ScheduledTime,
                MeetingLink = i.MeetingLink,
                InterviewType = i.InterviewType,
                Status = i.Status,
                ApplicationId = i.ApplicationId,
                JobTitle = i.Application != null && i.Application.JobPosting != null ? i.Application.JobPosting.Title : "Job",
                CandidateName = i.Application != null && i.Application.Candidate != null && i.Application.Candidate.User != null
                    ? $"{i.Application.Candidate.User.FirstName} {i.Application.Candidate.User.LastName}"
                    : "Candidate",
                InterviewerId = i.InterviewerId,
                InterviewerName = i.Interviewer != null ? $"{i.Interviewer.FirstName} {i.Interviewer.LastName}" : "Interviewer"
            })
            .ToListAsync();

        return Ok(interviews);
    }

    /// <summary>
    /// Update interview details or status (Recruiter or Admin only).
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Recruiter,Admin")]
    public async Task<ActionResult<InterviewResponseDto>> UpdateInterview(int id, [FromBody] UpdateInterviewDto dto)
    {
        var interview = await _context.InterviewSchedules
            .Include(i => i.Application).ThenInclude(a => a!.JobPosting)
            .Include(i => i.Application).ThenInclude(a => a!.Candidate).ThenInclude(c => c!.User)
            .Include(i => i.Interviewer)
            .FirstOrDefaultAsync(i => i.InterviewId == id);

        if (interview == null)
        {
            return NotFound(new { message = "Interview schedule not found." });
        }

        interview.ScheduledTime = dto.ScheduledTime;
        if (!string.IsNullOrEmpty(dto.MeetingLink)) interview.MeetingLink = dto.MeetingLink;
        if (!string.IsNullOrEmpty(dto.InterviewType)) interview.InterviewType = dto.InterviewType;
        if (!string.IsNullOrEmpty(dto.Status)) interview.Status = dto.Status;
        if (dto.InterviewerId.HasValue) interview.InterviewerId = dto.InterviewerId.Value;

        await _context.SaveChangesAsync();

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int.TryParse(userIdClaim, out int currentUserId);
        await _auditLogService.LogAsync("Interview Updated", $"Updated interview ID {id} status to '{interview.Status}'", currentUserId);

        return Ok(new InterviewResponseDto
        {
            InterviewId = interview.InterviewId,
            ScheduledTime = interview.ScheduledTime,
            MeetingLink = interview.MeetingLink,
            InterviewType = interview.InterviewType,
            Status = interview.Status,
            ApplicationId = interview.ApplicationId,
            JobTitle = interview.Application?.JobPosting?.Title ?? "Job",
            CandidateName = interview.Application?.Candidate?.User != null ? $"{interview.Application.Candidate.User.FirstName} {interview.Application.Candidate.User.LastName}" : "Candidate",
            InterviewerId = interview.InterviewerId,
            InterviewerName = interview.Interviewer != null ? $"{interview.Interviewer.FirstName} {interview.Interviewer.LastName}" : "Interviewer"
        });
    }
}
