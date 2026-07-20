using RecruitmentPlatform.API.DTOs;
using System;
using System.Web;

namespace RecruitmentPlatform.API.Services;

public class GoogleCalendarService
{
    public string GenerateGoogleCalendarUrl(CalendarEventRequestDto request)
    {
        var startUtc = request.StartTime.ToUniversalTime().ToString("yyyyMMddTHHmmssZ");
        var endUtc = request.EndTime.ToUniversalTime().ToString("yyyyMMddTHHmmssZ");

        var title = HttpUtility.UrlEncode(request.Title);
        var details = HttpUtility.UrlEncode($"{request.Description}\nMeeting Link: {request.LocationOrMeetingLink}");
        var location = HttpUtility.UrlEncode(request.LocationOrMeetingLink);

        return $"https://calendar.google.com/calendar/render?action=TEMPLATE&text={title}&details={details}&location={location}&dates={startUtc}/{endUtc}";
    }
}
