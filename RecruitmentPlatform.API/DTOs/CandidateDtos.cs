namespace RecruitmentPlatform.API.DTOs;

public class UpdateCandidateProfileDto
{
    public string ResumeUrl { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string ExperienceLevel { get; set; } = string.Empty;
}

public class CandidateResponseDto
{
    public int CandidateId { get; set; }
    public int UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ResumeUrl { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string ExperienceLevel { get; set; } = string.Empty;
}
