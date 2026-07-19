using System.ComponentModel.DataAnnotations;

namespace RecruitmentPlatform.API.Entities
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Candidate"; // Admin, Recruiter, HiringManager, Candidate

        public ICollection<JobPosting> JobPostings { get; set; } = new List<JobPosting>();
    }
}