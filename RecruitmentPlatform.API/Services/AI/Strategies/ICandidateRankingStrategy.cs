using RecruitmentPlatform.API.DTOs;
using RecruitmentPlatform.API.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace RecruitmentPlatform.API.Services.AI.Strategies;

public interface ICandidateRankingStrategy
{
    string StrategyName { get; }
    string Description { get; }
    Task<CandidateRankingResult> RankCandidateAsync(Candidate candidate, JobPosting jobPosting, CancellationToken cancellationToken = default);
}
