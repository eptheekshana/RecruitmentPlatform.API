using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecruitmentPlatform.API.Entities
{
    public class InterviewSchedule
    {
        [Key]
        public int InterviewId { get; set; }

        public DateTime ScheduledTime { get; set; }

        public string MeetingLink { get; set; } = string.Empty;

        [ForeignKey("Application")]
        public int ApplicationId { get; set; }
        public Application? Application { get; set; }

        [ForeignKey("Interviewer")]
        public int InterviewerId { get; set; }
        public User? Interviewer { get; set; }
    }
}