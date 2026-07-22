using RecruitmentPlatform.API.DTOs;
using System.Threading;
using System.Threading.Tasks;

namespace RecruitmentPlatform.API.Services.AI.Strategies;

public interface IResumeParsingStrategy
{
    string StrategyName { get; }
    string Description { get; }
    Task<ResumeParsingResult> ParseAsync(string resumeTextOrUrl, CancellationToken cancellationToken = default);
}
