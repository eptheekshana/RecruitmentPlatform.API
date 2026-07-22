using RecruitmentPlatform.API.DTOs;
using System;
using System.Web;

namespace RecruitmentPlatform.API.Services;

public class OutlookCalendarService
{
    public string GenerateOutlookCalendarUrl(CalendarEventRequestDto request)
    {
        var startUtc = request.StartTime.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ");
        var endUtc = request.EndTime.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ");

        var title = HttpUtility.UrlEncode(request.Title);
        var details = HttpUtility.UrlEncode($"{request.Description}\nMeeting Link: {request.LocationOrMeetingLink}");
        var location = HttpUtility.UrlEncode(request.LocationOrMeetingLink);

        return $"https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject={title}&body={details}&location={location}&startdt={startUtc}&enddt={endUtc}";
    }
}
