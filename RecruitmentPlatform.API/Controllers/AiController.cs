using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecruitmentPlatform.API.Data;
using RecruitmentPlatform.API.DTOs;
using RecruitmentPlatform.API.Entities;
using RecruitmentPlatform.API.Services;
using RecruitmentPlatform.API.Services.AI;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RecruitmentPlatform.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AiController : ControllerBase
{
    private readonly IAiStrategyFactory _aiStrategyFactory;
    private readonly ResumeAnalysisService _resumeAnalysisService;
    private readonly MatchingService _matchingService;
    private readonly ApplicationDbContext _context;

    public AiController(
        IAiStrategyFactory aiStrategyFactory,
        ResumeAnalysisService resumeAnalysisService,
        MatchingService matchingService,
        ApplicationDbContext context)
    {
        _aiStrategyFactory = aiStrategyFactory;
        _resumeAnalysisService = resumeAnalysisService;
        _matchingService = matchingService;
        _context = context;
    }

    /// <summary>
    /// List all registered Strategy Pattern options for AI services.
    /// </summary>
    [HttpGet("strategies")]
    [AllowAnonymous]
    public ActionResult<IEnumerable<AiStrategyInfoDto>> GetAvailableStrategies()
    {
        var strategies = _aiStrategyFactory.GetAvailableStrategies();
        return Ok(strategies);
    }

    /// <summary>
    /// Parse resume document or text using the selected Resume Parsing Strategy (OpenAI, RuleBased, Mock).
    /// </summary>
    [HttpPost("parse-resume")]
    public async Task<ActionResult<ResumeParsingResult>> ParseResume([FromBody] ParseResumeRequestDto request)
    {
        string contentToParse = !string.IsNullOrWhiteSpace(request.ResumeText) 
            ? request.ResumeText 
            : (!string.IsNullOrWhiteSpace(request.ResumeUrl) ? request.ResumeUrl : "Candidate Resume Document Content with C#, ASP.NET Core, React, and SQL experience.");

        var result = await _resumeAnalysisService.ParseResumeDetailsAsync(contentToParse, request.PreferredStrategy);
        return Ok(result);
    }

    /// <summary>
    /// Extract and categorize skills from text content using the selected Skill Extraction Strategy (OpenAI, TaxonomyNLP, Mock).
    /// </summary>
    [HttpPost("extract-skills")]
    public async Task<ActionResult<SkillExtractionResult>> ExtractSkills([FromBody] ExtractSkillsRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Content))
        {
            return BadRequest(new { message = "Content parameter is required for skill extraction." });
        }

        var result = await _resumeAnalysisService.ExtractSkillsFromContentAsync(request.Content, request.PreferredStrategy);
        return Ok(result);
    }

    /// <summary>
    /// Rank candidate compatibility for a job posting using the selected Candidate Ranking Strategy (SemanticAI, WeightedKeyword, RuleBased).
    /// </summary>
    [HttpPost("rank-candidate")]
    public async Task<ActionResult<CandidateRankingResult>> RankCandidate([FromBody] RankCandidateRequestDto request)
    {
        Candidate candidate;
        JobPosting jobPosting;

        if (request.CandidateId.HasValue && request.CandidateId.Value > 0)
        {
            candidate = await _context.Candidates.FindAsync(request.CandidateId.Value) 
                ?? new Candidate { Skills = request.CandidateSkills, ExperienceLevel = request.ExperienceLevel };
        }
        else
        {
            candidate = new Candidate
            {
                Skills = request.CandidateSkills,
                ExperienceLevel = string.IsNullOrWhiteSpace(request.ExperienceLevel) ? "Mid" : request.ExperienceLevel
            };
        }

        if (request.JobId.HasValue && request.JobId.Value > 0)
        {
            jobPosting = await _context.JobPostings.FindAsync(request.JobId.Value) 
                ?? new JobPosting { Requirements = request.JobRequirements, Title = request.JobTitle };
        }
        else
        {
            jobPosting = new JobPosting
            {
                Title = string.IsNullOrWhiteSpace(request.JobTitle) ? "Software Engineer" : request.JobTitle,
                Requirements = string.IsNullOrWhiteSpace(request.JobRequirements) ? "C#, ASP.NET Core, SQL" : request.JobRequirements
            };
        }

        var rankingResult = await _matchingService.RankCandidateWithDetailsAsync(candidate, jobPosting, request.PreferredStrategy);
        return Ok(rankingResult);
    }
}
