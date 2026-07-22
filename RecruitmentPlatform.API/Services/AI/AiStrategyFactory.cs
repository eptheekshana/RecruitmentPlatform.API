using Microsoft.Extensions.Configuration;
using RecruitmentPlatform.API.DTOs;
using RecruitmentPlatform.API.Services.AI.Strategies;
using System;
using System.Collections.Generic;
using System.Linq;

namespace RecruitmentPlatform.API.Services.AI;

public interface IAiStrategyFactory
{
    IResumeParsingStrategy GetResumeParsingStrategy(string? strategyName = null);
    ISkillExtractionStrategy GetSkillExtractionStrategy(string? strategyName = null);
    ICandidateRankingStrategy GetCandidateRankingStrategy(string? strategyName = null);
    IEnumerable<AiStrategyInfoDto> GetAvailableStrategies();
}

public class AiStrategyFactory : IAiStrategyFactory
{
    private readonly IEnumerable<IResumeParsingStrategy> _resumeParsingStrategies;
    private readonly IEnumerable<ISkillExtractionStrategy> _skillExtractionStrategies;
    private readonly IEnumerable<ICandidateRankingStrategy> _candidateRankingStrategies;
    private readonly IConfiguration _configuration;

    public AiStrategyFactory(
        IEnumerable<IResumeParsingStrategy> resumeParsingStrategies,
        IEnumerable<ISkillExtractionStrategy> skillExtractionStrategies,
        IEnumerable<ICandidateRankingStrategy> candidateRankingStrategies,
        IConfiguration configuration)
    {
        _resumeParsingStrategies = resumeParsingStrategies;
        _skillExtractionStrategies = skillExtractionStrategies;
        _candidateRankingStrategies = candidateRankingStrategies;
        _configuration = configuration;
    }

    public IResumeParsingStrategy GetResumeParsingStrategy(string? strategyName = null)
    {
        string targetStrategy = strategyName 
            ?? _configuration["AiSettings:DefaultResumeParsingStrategy"] 
            ?? "OpenAI";

        var strategy = _resumeParsingStrategies.FirstOrDefault(s => s.StrategyName.Equals(targetStrategy, StringComparison.OrdinalIgnoreCase));
        
        return strategy ?? _resumeParsingStrategies.First(s => s.StrategyName.Equals("Mock", StringComparison.OrdinalIgnoreCase));
    }

    public ISkillExtractionStrategy GetSkillExtractionStrategy(string? strategyName = null)
    {
        string targetStrategy = strategyName 
            ?? _configuration["AiSettings:DefaultSkillExtractionStrategy"] 
            ?? "OpenAI";

        var strategy = _skillExtractionStrategies.FirstOrDefault(s => s.StrategyName.Equals(targetStrategy, StringComparison.OrdinalIgnoreCase));

        return strategy ?? _skillExtractionStrategies.First(s => s.StrategyName.Equals("Mock", StringComparison.OrdinalIgnoreCase));
    }

    public ICandidateRankingStrategy GetCandidateRankingStrategy(string? strategyName = null)
    {
        string targetStrategy = strategyName 
            ?? _configuration["AiSettings:DefaultCandidateRankingStrategy"] 
            ?? "SemanticAI";

        var strategy = _candidateRankingStrategies.FirstOrDefault(s => s.StrategyName.Equals(targetStrategy, StringComparison.OrdinalIgnoreCase));

        return strategy ?? _candidateRankingStrategies.First(s => s.StrategyName.Equals("WeightedKeyword", StringComparison.OrdinalIgnoreCase));
    }

    public IEnumerable<AiStrategyInfoDto> GetAvailableStrategies()
    {
        var list = new List<AiStrategyInfoDto>();

        string defaultParsing = _configuration["AiSettings:DefaultResumeParsingStrategy"] ?? "OpenAI";
        string defaultSkill = _configuration["AiSettings:DefaultSkillExtractionStrategy"] ?? "OpenAI";
        string defaultRanking = _configuration["AiSettings:DefaultCandidateRankingStrategy"] ?? "SemanticAI";

        foreach (var s in _resumeParsingStrategies)
        {
            list.Add(new AiStrategyInfoDto
            {
                Category = "ResumeParsing",
                Name = s.StrategyName,
                Description = s.Description,
                IsDefault = s.StrategyName.Equals(defaultParsing, StringComparison.OrdinalIgnoreCase)
            });
        }

        foreach (var s in _skillExtractionStrategies)
        {
            list.Add(new AiStrategyInfoDto
            {
                Category = "SkillExtraction",
                Name = s.StrategyName,
                Description = s.Description,
                IsDefault = s.StrategyName.Equals(defaultSkill, StringComparison.OrdinalIgnoreCase)
            });
        }

        foreach (var s in _candidateRankingStrategies)
        {
            list.Add(new AiStrategyInfoDto
            {
                Category = "CandidateRanking",
                Name = s.StrategyName,
                Description = s.Description,
                IsDefault = s.StrategyName.Equals(defaultRanking, StringComparison.OrdinalIgnoreCase)
            });
        }

        return list;
    }
}
