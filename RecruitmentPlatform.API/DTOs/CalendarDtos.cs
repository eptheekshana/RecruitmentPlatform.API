using System;

namespace RecruitmentPlatform.API.DTOs;

public class CalendarEventRequestDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string LocationOrMeetingLink { get; set; } = string.Empty;
    public string CandidateEmail { get; set; } = string.Empty;
    public string InterviewerEmail { get; set; } = string.Empty;
}

public class CalendarEventResultDto
{
    public string GoogleCalendarUrl { get; set; } = string.Empty;
    public string OutlookCalendarUrl { get; set; } = string.Empty;
    public string IcsContent { get; set; } = string.Empty;
}
