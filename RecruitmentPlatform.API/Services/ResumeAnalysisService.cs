using RecruitmentPlatform.API.DTOs;
using RecruitmentPlatform.API.Services.AI;
using System.Threading;
using System.Threading.Tasks;

namespace RecruitmentPlatform.API.Services;

public class ResumeAnalysisService
{
    private readonly IAiStrategyFactory _aiStrategyFactory;

    public ResumeAnalysisService(IAiStrategyFactory aiStrategyFactory)
    {
        _aiStrategyFactory = aiStrategyFactory;
    }

    public async Task<(decimal score, string skills)> AnalyzeResumeAsync(string resumeUrl, string jobDescription, string? preferredStrategy = null)
    {
        var parsingStrategy = _aiStrategyFactory.GetResumeParsingStrategy(preferredStrategy);
        var parsedResult = await parsingStrategy.ParseAsync(resumeUrl);

        var skillStrategy = _aiStrategyFactory.GetSkillExtractionStrategy(preferredStrategy);
        var extractedSkills = await skillStrategy.ExtractSkillsAsync(jobDescription);

        string joinedSkills = string.Join(", ", parsedResult.ExtractedSkills);
        if (string.IsNullOrEmpty(joinedSkills))
        {
            joinedSkills = string.Join(", ", extractedSkills.AllSkills);
        }

        return (85.0m, joinedSkills);
    }

    public async Task<ResumeParsingResult> ParseResumeDetailsAsync(string resumeContent, string? preferredStrategy = null, CancellationToken cancellationToken = default)
    {
        var parsingStrategy = _aiStrategyFactory.GetResumeParsingStrategy(preferredStrategy);
        return await parsingStrategy.ParseAsync(resumeContent, cancellationToken);
    }

    public async Task<SkillExtractionResult> ExtractSkillsFromContentAsync(string content, string? preferredStrategy = null, CancellationToken cancellationToken = default)
    {
        var skillStrategy = _aiStrategyFactory.GetSkillExtractionStrategy(preferredStrategy);
        return await skillStrategy.ExtractSkillsAsync(content, cancellationToken);
    }
}
