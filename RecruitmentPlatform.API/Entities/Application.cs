using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecruitmentPlatform.API.Entities;

public class Application
{
    [Key]
    public int ApplicationId { get; set; }

    public string Status { get; set; } = "Pending";
    public decimal AIScore { get; set; }
    public DateTime AppliedDate { get; set; } = DateTime.UtcNow;
    public string CoverLetter { get; set; } = string.Empty;

    [ForeignKey("Candidate")]
    public int CandidateId { get; set; }
    public Candidate? Candidate { get; set; }

    [ForeignKey("JobPosting")]
    public int JobId { get; set; }
    public JobPosting? JobPosting { get; set; }
}
