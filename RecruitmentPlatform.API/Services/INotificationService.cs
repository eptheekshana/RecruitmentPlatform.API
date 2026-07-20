using System.Threading.Tasks;

namespace RecruitmentPlatform.API.Services;

public interface INotificationService
{
    Task SendEmailAsync(string recipientEmail, string subject, string bodyHtml);
    Task SendSmsAsync(string recipientPhoneNumber, string message);
    Task SendInterviewNotificationAsync(
        string candidateEmail, 
        string candidateName, 
        string jobTitle, 
        string scheduledTimeText, 
        string meetingLink, 
        string googleCalendarUrl, 
        string outlookCalendarUrl);
}
