using RecruitmentPlatform.API.DTOs;
using System.Threading;
using System.Threading.Tasks;

namespace RecruitmentPlatform.API.Services.AI.Strategies;

public interface ISkillExtractionStrategy
{
    string StrategyName { get; }
    string Description { get; }
    Task<SkillExtractionResult> ExtractSkillsAsync(string textContent, CancellationToken cancellationToken = default);
}
