using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecruitmentPlatform.API.Entities
{
    public class Candidate : User
    {
        public string ResumeUrl { get; set; } = string.Empty;
        public string Skills { get; set; } = string.Empty; // Extracted skills using AI

        public ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}