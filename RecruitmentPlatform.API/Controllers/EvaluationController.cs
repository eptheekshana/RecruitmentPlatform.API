// Handles candidate evaluations, status updates, and evaluation history.

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
[Authorize]
public class EvaluationController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly AuditLogService _auditLogService;

    public EvaluationController(ApplicationDbContext context, AuditLogService auditLogService)
    {
        _context = context;
        _auditLogService = auditLogService;
    }

    /// <summary>
    /// Submit a new candidate evaluation (Hiring Managers only).
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "HiringManager")]
    public async Task<ActionResult<EvaluationResponseDto>> CreateEvaluation([FromBody] CreateEvaluationDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int evaluatorId))
        {
            return Unauthorized();
        }

        var application = await _context.Applications
            .Include(a => a.Candidate).ThenInclude(c => c!.User)
            .Include(a => a.JobPosting)
            .FirstOrDefaultAsync(a => a.ApplicationId == dto.ApplicationId);

        if (application == null)
        {
            return NotFound(new { message = "Application not found." });
        }

        // Create the evaluation history record
        var evaluation = new Evaluation
        {
            ApplicationId = dto.ApplicationId,
            EvaluatorId = evaluatorId,
            Score = dto.Score,
            Comments = dto.Comments,
            Recommendation = dto.Recommendation,
            CreatedDate = DateTime.UtcNow
        };

        _context.Evaluations.Add(evaluation);

        // Update the application status to match recommendation
        if (dto.Recommendation.Equals("Accepted", StringComparison.OrdinalIgnoreCase) || 
            dto.Recommendation.Equals("Recommended", StringComparison.OrdinalIgnoreCase))
        {
            application.Status = "Accepted"; // Or Recommended
        }
        else if (dto.Recommendation.Equals("Rejected", StringComparison.OrdinalIgnoreCase))
        {
            application.Status = "Rejected";
        }
        else if (dto.Recommendation.Equals("Interview", StringComparison.OrdinalIgnoreCase) || 
                 dto.Recommendation.Equals("Pending Interview", StringComparison.OrdinalIgnoreCase))
        {
            application.Status = "Interviewing";
        }
        else
        {
            application.Status = "Evaluated";
        }

        await _context.SaveChangesAsync();

        var evaluator = await _context.Users.FindAsync(evaluatorId);
        var evaluatorName = evaluator != null ? $"{evaluator.FirstName} {evaluator.LastName}" : "Hiring Manager";

        await _auditLogService.LogAsync(
            "Candidate Evaluated", 
            $"Hiring Manager '{evaluator?.Email}' evaluated application ID {dto.ApplicationId} with score {dto.Score} ({dto.Recommendation})", 
            evaluatorId
        );

        return CreatedAtAction(nameof(GetEvaluationsForApplication), new { applicationId = evaluation.ApplicationId }, new EvaluationResponseDto
        {
            EvaluationId = evaluation.EvaluationId,
            ApplicationId = evaluation.ApplicationId,
            EvaluatorId = evaluatorId,
            EvaluatorName = evaluatorName,
            Score = evaluation.Score,
            Comments = evaluation.Comments,
            Recommendation = evaluation.Recommendation,
            CreatedDate = evaluation.CreatedDate
        });
    }

    /// <summary>
    /// Get all evaluations for a specific application.
    /// </summary>
    [HttpGet("application/{applicationId}")]
    public async Task<ActionResult<IEnumerable<EvaluationResponseDto>>> GetEvaluationsForApplication(int applicationId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized();
        }

        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        var application = await _context.Applications
            .Include(a => a.Candidate)
            .FirstOrDefaultAsync(a => a.ApplicationId == applicationId);

        if (application == null)
        {
            return NotFound(new { message = "Application not found." });
        }

        // Security check: Candidate can only see their own application's evaluations
        if (userRole == "Candidate" && application.Candidate?.UserId != userId)
        {
            return Forbid();
        }

        var evaluations = await _context.Evaluations
            .Include(e => e.Evaluator)
            .Where(e => e.ApplicationId == applicationId)
            .OrderByDescending(e => e.CreatedDate)
            .Select(e => new EvaluationResponseDto
            {
                EvaluationId = e.EvaluationId,
                ApplicationId = e.ApplicationId,
                EvaluatorId = e.EvaluatorId,
                EvaluatorName = e.Evaluator != null ? $"{e.Evaluator.FirstName} {e.Evaluator.LastName}" : "Hiring Manager",
                Score = e.Score,
                Comments = e.Comments,
                Recommendation = e.Recommendation,
                CreatedDate = e.CreatedDate
            })
            .ToListAsync();

        return Ok(evaluations);
    }

    /// <summary>
    /// Get all evaluations submitted by the current hiring manager.
    /// </summary>
    [HttpGet("my")]
    [Authorize(Roles = "HiringManager")]
    public async Task<ActionResult<IEnumerable<EvaluationResponseDto>>> GetMyEvaluations()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out int evaluatorId))
        {
            return Unauthorized();
        }

        var evaluations = await _context.Evaluations
            .Include(e => e.Evaluator)
            .Include(e => e.Application).ThenInclude(a => a!.Candidate).ThenInclude(c => c!.User)
            .Include(e => e.Application).ThenInclude(a => a!.JobPosting)
            .Where(e => e.EvaluatorId == evaluatorId)
            .OrderByDescending(e => e.CreatedDate)
            .Select(e => new EvaluationResponseDto
            {
                EvaluationId = e.EvaluationId,
                ApplicationId = e.ApplicationId,
                EvaluatorId = e.EvaluatorId,
                EvaluatorName = e.Evaluator != null ? $"{e.Evaluator.FirstName} {e.Evaluator.LastName}" : "Hiring Manager",
                Score = e.Score,
                Comments = e.Comments,
                Recommendation = e.Recommendation,
                CreatedDate = e.CreatedDate
            })
            .ToListAsync();

        return Ok(evaluations);
    }
}
