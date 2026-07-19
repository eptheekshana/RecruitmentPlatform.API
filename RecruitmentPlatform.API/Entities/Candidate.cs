using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecruitmentPlatform.API.Entities;

public class Candidate
{
    [Key]
    public int CandidateId { get; set; }

    [ForeignKey("User")]
    public int UserId { get; set; }
    public User? User { get; set; }

    public string ResumeUrl { get; set; } = string.Empty;
    public string Skills { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string ExperienceLevel { get; set; } = string.Empty;

    public ICollection<Application> Applications { get; set; } = new List<Application>();
}
