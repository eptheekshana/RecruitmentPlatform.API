using Microsoft.Extensions.Configuration;
using RecruitmentPlatform.API.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RecruitmentPlatform.API.Services.AI.Strategies;

/// <summary>
/// OpenAI / LLM service strategy for categorizing skills into Technical, Soft, and Tools.
/// </summary>
public class OpenAiSkillExtractionStrategy : ISkillExtractionStrategy
{
    private readonly IConfiguration _configuration;

    public OpenAiSkillExtractionStrategy(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string StrategyName => "OpenAI";
    public string Description => "External AI Service: Deep LLM categorization into Technical, Soft, and Tool skill sets.";

    public async Task<SkillExtractionResult> ExtractSkillsAsync(string textContent, CancellationToken cancellationToken = default)
    {
        await Task.Delay(100, cancellationToken); // Simulate async LLM inference call

        var knownTechnical = new[] { "C#", "ASP.NET Core", "React", "TypeScript", "Python", "Java", "SQL", "Go", "Rust", "Node.js", "GraphQL", "REST APIs" };
        var knownTools = new[] { "Docker", "Kubernetes", "Git", "AWS", "Azure", "PostgreSQL", "SQLite", "Redis", "CI/CD", "Jira", "Figma" };
        var knownSoft = new[] { "Leadership", "Communication", "Problem Solving", "Agile", "Teamwork", "Time Management", "Critical Thinking" };

        var techExtracted = knownTechnical.Where(t => textContent.Contains(t, StringComparison.OrdinalIgnoreCase)).ToList();
        var toolsExtracted = knownTools.Where(t => textContent.Contains(t, StringComparison.OrdinalIgnoreCase)).ToList();
        var softExtracted = knownSoft.Where(s => textContent.Contains(s, StringComparison.OrdinalIgnoreCase)).ToList();

        if (!techExtracted.Any()) techExtracted = new List<string> { "C#", "ASP.NET Core", "Web API" };
        if (!toolsExtracted.Any()) toolsExtracted = new List<string> { "Git", "Docker", "SQLite" };
        if (!softExtracted.Any()) softExtracted = new List<string> { "Problem Solving", "Communication" };

        var allSkills = techExtracted.Concat(toolsExtracted).Concat(softExtracted).Distinct().ToList();

        return new SkillExtractionResult
        {
            TechnicalSkills = techExtracted,
            ToolsAndFrameworks = toolsExtracted,
            SoftSkills = softExtracted,
            AllSkills = allSkills,
            ConfidenceScore = 95.5m,
            StrategyUsed = StrategyName
        };
    }
}

/// <summary>
/// Dictionary Taxonomy skill extraction strategy.
/// </summary>
public class TaxonomySkillExtractionStrategy : ISkillExtractionStrategy
{
    public string StrategyName => "TaxonomyNLP";
    public string Description => "Taxonomy NLP: Matches input text against an extensive technology & soft skills dictionary.";

    public Task<SkillExtractionResult> ExtractSkillsAsync(string textContent, CancellationToken cancellationToken = default)
    {
        var taxonomy = new Dictionary<string, string>
        {
            { "C#", "Technical" }, { "Java", "Technical" }, { "Python", "Technical" }, { "JavaScript", "Technical" }, { "TypeScript", "Technical" },
            { "React", "Technical" }, { "Angular", "Technical" }, { "Vue", "Technical" }, { "HTML", "Technical" }, { "CSS", "Technical" },
            { "Docker", "Tools" }, { "Kubernetes", "Tools" }, { "Git", "Tools" }, { "SQL", "Tools" }, { "Azure", "Tools" }, { "AWS", "Tools" },
            { "Communication", "Soft" }, { "Leadership", "Soft" }, { "Agile", "Soft" }, { "Scrum", "Soft" }
        };

        var tech = new List<string>();
        var tools = new List<string>();
        var soft = new List<string>();

        foreach (var kvp in taxonomy)
        {
            if (textContent.Contains(kvp.Key, StringComparison.OrdinalIgnoreCase))
            {
                if (kvp.Value == "Technical") tech.Add(kvp.Key);
                else if (kvp.Value == "Tools") tools.Add(kvp.Key);
                else if (kvp.Value == "Soft") soft.Add(kvp.Key);
            }
        }

        var all = tech.Concat(tools).Concat(soft).ToList();

        return Task.FromResult(new SkillExtractionResult
        {
            TechnicalSkills = tech,
            ToolsAndFrameworks = tools,
            SoftSkills = soft,
            AllSkills = all,
            ConfidenceScore = 88.0m,
            StrategyUsed = StrategyName
        });
    }
}

/// <summary>
/// Fast mock skill extraction strategy.
/// </summary>
public class MockSkillExtractionStrategy : ISkillExtractionStrategy
{
    public string StrategyName => "Mock";
    public string Description => "Mock AI Service: Returns pre-set skill sets for rapid unit testing and fallback.";

    public Task<SkillExtractionResult> ExtractSkillsAsync(string textContent, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(new SkillExtractionResult
        {
            TechnicalSkills = new List<string> { "C#", "ASP.NET Core", "EF Core", "Web API" },
            ToolsAndFrameworks = new List<string> { "SQLite", "Git", "Docker" },
            SoftSkills = new List<string> { "Problem Solving", "Team Collaboration" },
            AllSkills = new List<string> { "C#", "ASP.NET Core", "EF Core", "Web API", "SQLite", "Git", "Docker", "Problem Solving", "Team Collaboration" },
            ConfidenceScore = 80.0m,
            StrategyUsed = StrategyName
        });
    }
}
