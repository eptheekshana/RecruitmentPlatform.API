using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecruitmentPlatform.API.Entities
{
    public class JobPosting
    {
        [Key]
        public int JobId { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public string? Requirements { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime PostedDate { get; set; } = DateTime.UtcNow;

        // Foreign Key linking to the User (Recruiter)
        [ForeignKey("Recruiter")]
        public int RecruiterId { get; set; }
        public User? Recruiter { get; set; }
    }
}
