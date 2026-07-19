using System.Threading.Tasks;

namespace RecruitmentPlatform.API.Services;

public class ResumeAnalysisService
{
    public Task<(decimal score, string skills)> AnalyzeResumeAsync(string resumeUrl, string jobDescription)
    {
        // Mock AI-based parsing and analysis
        decimal mockScore = 85.0m;
        string mockSkills = "C#, ASP.NET Core, EF Core, SQLite, Web API, JWT";
        return Task.FromResult((mockScore, mockSkills));
    }
}
