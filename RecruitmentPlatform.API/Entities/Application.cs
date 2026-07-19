using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecruitmentPlatform.API.Entities
{
    public class Application
    {
        [Key]
        public int ApplicationId { get; set; }

        public string Status { get; set; } = "Pending"; // Pending, Interview, Rejected, Hired

        // This stores the AI-driven candidate ranking score
        public decimal AIScore { get; set; }

        public DateTime AppliedDate { get; set; } = DateTime.UtcNow;

        // Foreign Key to the Candidate
        [ForeignKey("Candidate")]
        public int CandidateId { get; set; }
        public Candidate? Candidate { get; set; }

        // Foreign Key to the Job Posting
        [ForeignKey("JobPosting")]
        public int JobId { get; set; }
        public JobPosting? JobPosting { get; set; }
    }
}