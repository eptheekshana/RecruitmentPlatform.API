using RecruitmentPlatform.API.DTOs;

namespace RecruitmentPlatform.API.Services;

public interface ICalendarIntegrationService
{
    CalendarEventResultDto GenerateCalendarEvent(CalendarEventRequestDto request);
}
