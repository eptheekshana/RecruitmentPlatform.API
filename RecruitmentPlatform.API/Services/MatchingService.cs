using RecruitmentPlatform.API.Entities;
using System.Threading.Tasks;

namespace RecruitmentPlatform.API.Services;

public class MatchingService
{
    public Task<decimal> CalculateMatchScoreAsync(Candidate candidate, JobPosting jobPosting)
    {
        // Simple mock matching based on keyword overlap
        decimal score = 50.0m;
        
        if (!string.IsNullOrEmpty(candidate.Skills) && !string.IsNullOrEmpty(jobPosting.Requirements))
        {
            var candidateSkills = candidate.Skills.Split(new[] { ',', ';' }, System.StringSplitOptions.RemoveEmptyEntries);
            int matchCount = 0;
            foreach (var skill in candidateSkills)
            {
                var trimmedSkill = skill.Trim();
                if (jobPosting.Requirements.Contains(trimmedSkill, System.StringComparison.OrdinalIgnoreCase))
                {
                    matchCount++;
                }
            }
            score += matchCount * 10m;
        }

        if (candidate.ExperienceLevel == "Senior")
        {
            score += 15m;
        }
        else if (candidate.ExperienceLevel == "Mid")
        {
            score += 5m;
        }

        if (score > 100m) score = 100m;
        return Task.FromResult(score);
    }
}
