using System;
using System.ComponentModel.DataAnnotations;

namespace RecruitmentPlatform.API.DTOs;

public class CreateInterviewDto
{
    [Required]
    public int ApplicationId { get; set; }

    [Required]
    public DateTime ScheduledTime { get; set; }

    public string MeetingLink { get; set; } = string.Empty;
    public string InterviewType { get; set; } = "Technical"; // "Technical", "HR", "Final"
    public int? InterviewerId { get; set; }
}

public class UpdateInterviewDto
{
    public DateTime ScheduledTime { get; set; }
    public string MeetingLink { get; set; } = string.Empty;
    public string InterviewType { get; set; } = string.Empty;
    public string Status { get; set; } = "Scheduled"; // "Scheduled", "Completed", "Cancelled"
    public int? InterviewerId { get; set; }
}

public class InterviewResponseDto
{
    public int InterviewId { get; set; }
    public DateTime ScheduledTime { get; set; }
    public string MeetingLink { get; set; } = string.Empty;
    public string InterviewType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public int ApplicationId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string CandidateName { get; set; } = string.Empty;
    public int? InterviewerId { get; set; }
    public string InterviewerName { get; set; } = string.Empty;
    public string GoogleCalendarUrl { get; set; } = string.Empty;
    public string OutlookCalendarUrl { get; set; } = string.Empty;
}
