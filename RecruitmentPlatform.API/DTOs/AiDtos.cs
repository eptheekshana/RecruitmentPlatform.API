using System.Collections.Generic;

namespace RecruitmentPlatform.API.DTOs;

public class ResumeParsingResult
{
    public string CandidateName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string SuggestedExperienceLevel { get; set; } = string.Empty; // Entry, Mid, Senior, Lead
    public List<string> ExtractedSkills { get; set; } = new();
    public List<string> WorkExperience { get; set; } = new();
    public List<string> Education { get; set; } = new();
    public string RawText { get; set; } = string.Empty;
    public string StrategyUsed { get; set; } = string.Empty;
}

public class SkillExtractionResult
{
    public List<string> TechnicalSkills { get; set; } = new();
    public List<string> SoftSkills { get; set; } = new();
    public List<string> ToolsAndFrameworks { get; set; } = new();
    public List<string> AllSkills { get; set; } = new();
    public decimal ConfidenceScore { get; set; }
    public string StrategyUsed { get; set; } = string.Empty;
}

public class CandidateRankingResult
{
    public decimal Score { get; set; } // Score between 0 and 100
    public decimal SkillMatchScore { get; set; }
    public decimal ExperienceMatchScore { get; set; }
    public List<string> MatchingSkills { get; set; } = new();
    public List<string> MissingSkills { get; set; } = new();
    public string Explanation { get; set; } = string.Empty;
    public string StrategyUsed { get; set; } = string.Empty;
}

public class ParseResumeRequestDto
{
    public string ResumeText { get; set; } = string.Empty;
    public string ResumeUrl { get; set; } = string.Empty;
    public string? PreferredStrategy { get; set; }
}

public class ExtractSkillsRequestDto
{
    public string Content { get; set; } = string.Empty;
    public string? PreferredStrategy { get; set; }
}

public class RankCandidateRequestDto
{
    public int? CandidateId { get; set; }
    public int? JobId { get; set; }
    public string CandidateSkills { get; set; } = string.Empty;
    public string ExperienceLevel { get; set; } = string.Empty;
    public string JobRequirements { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public string? PreferredStrategy { get; set; }
}

public class AiStrategyInfoDto
{
    public string Category { get; set; } = string.Empty; // ResumeParsing, SkillExtraction, CandidateRanking
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
}
