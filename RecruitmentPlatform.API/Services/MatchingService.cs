using RecruitmentPlatform.API.DTOs;
using RecruitmentPlatform.API.Entities;
using RecruitmentPlatform.API.Services.AI;
using System.Threading;
using System.Threading.Tasks;

namespace RecruitmentPlatform.API.Services;

public class MatchingService
{
    private readonly IAiStrategyFactory _aiStrategyFactory;

    public MatchingService(IAiStrategyFactory aiStrategyFactory)
    {
        _aiStrategyFactory = aiStrategyFactory;
    }

    public async Task<decimal> CalculateMatchScoreAsync(Candidate candidate, JobPosting jobPosting, string? preferredStrategy = null)
    {
        var rankingStrategy = _aiStrategyFactory.GetCandidateRankingStrategy(preferredStrategy);
        var rankingResult = await rankingStrategy.RankCandidateAsync(candidate, jobPosting);
        return rankingResult.Score;
    }

    public async Task<CandidateRankingResult> RankCandidateWithDetailsAsync(Candidate candidate, JobPosting jobPosting, string? preferredStrategy = null, CancellationToken cancellationToken = default)
    {
        var rankingStrategy = _aiStrategyFactory.GetCandidateRankingStrategy(preferredStrategy);
        return await rankingStrategy.RankCandidateAsync(candidate, jobPosting, cancellationToken);
    }
}
