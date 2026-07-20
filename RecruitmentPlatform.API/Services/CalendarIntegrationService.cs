using RecruitmentPlatform.API.DTOs;
using System;

namespace RecruitmentPlatform.API.Services;

public class CalendarIntegrationService : ICalendarIntegrationService
{
    private readonly GoogleCalendarService _googleService;
    private readonly OutlookCalendarService _outlookService;

    public CalendarIntegrationService(GoogleCalendarService googleService, OutlookCalendarService outlookService)
    {
        _googleService = googleService;
        _outlookService = outlookService;
    }

    public CalendarEventResultDto GenerateCalendarEvent(CalendarEventRequestDto request)
    {
        var googleUrl = _googleService.GenerateGoogleCalendarUrl(request);
        var outlookUrl = _outlookService.GenerateOutlookCalendarUrl(request);

        var startUtc = request.StartTime.ToUniversalTime().ToString("yyyyMMddTHHmmssZ");
        var endUtc = request.EndTime.ToUniversalTime().ToString("yyyyMMddTHHmmssZ");

        var icsContent = $@"BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//RecruitmentPlatform//NONSGML v1.0//EN
BEGIN:VEVENT
UID:{Guid.NewGuid()}@recruitmentplatform.com
DTSTAMP:{DateTime.UtcNow:yyyyMMddTHHmmssZ}
DTSTART:{startUtc}
DTEND:{endUtc}
SUMMARY:{request.Title}
DESCRIPTION:{request.Description}
LOCATION:{request.LocationOrMeetingLink}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR";

        return new CalendarEventResultDto
        {
            GoogleCalendarUrl = googleUrl,
            OutlookCalendarUrl = outlookUrl,
            IcsContent = icsContent
        };
    }
}
