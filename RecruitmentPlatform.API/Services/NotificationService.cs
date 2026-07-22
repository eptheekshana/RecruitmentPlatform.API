using System.Threading.Tasks;

namespace RecruitmentPlatform.API.Services;

public class NotificationService : INotificationService
{
    private readonly EmailNotificationService _emailService;
    private readonly SmsNotificationService _smsService;

    public NotificationService(EmailNotificationService emailService, SmsNotificationService smsService)
    {
        _emailService = emailService;
        _smsService = smsService;
    }

    public async Task SendEmailAsync(string recipientEmail, string subject, string bodyHtml)
    {
        await _emailService.SendEmailAsync(recipientEmail, subject, bodyHtml);
    }

    public async Task SendSmsAsync(string recipientPhoneNumber, string message)
    {
        await _smsService.SendSmsAsync(recipientPhoneNumber, message);
    }

    public async Task SendInterviewNotificationAsync(
        string candidateEmail,
        string candidateName,
        string jobTitle,
        string scheduledTimeText,
        string meetingLink,
        string googleCalendarUrl,
        string outlookCalendarUrl)
    {
        string subject = $"Interview Invitation: {jobTitle} position";

        string bodyHtml = $@"
<!DOCTYPE html>
<html>
<head>
<style>
    body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 20px; }}
    .container {{ max-width: 600px; background-color: #131b2e; padding: 30px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin: 0 auto; }}
    h2 {{ color: #38bdf8; margin-top: 0; }}
    .btn {{ display: inline-block; padding: 12px 20px; margin: 8px 5px 8px 0; border-radius: 8px; text-decoration: none; font-weight: bold; }}
    .btn-primary {{ background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; }}
    .btn-secondary {{ background-color: #1e293b; color: #38bdf8; border: 1px solid #38bdf8; }}
</style>
</head>
<body>
<div class='container'>
    <h2>Interview Scheduled!</h2>
    <p>Dear <strong>{candidateName}</strong>,</p>
    <p>Your interview for the <strong>{jobTitle}</strong> position has been scheduled.</p>
    <p><strong>Date & Time:</strong> {scheduledTimeText}</p>
    <p><strong>Meeting Link:</strong> <a href='{meetingLink}' style='color: #38bdf8;'>{meetingLink}</a></p>

    <div style='margin-top: 25px;'>
        <a href='{googleCalendarUrl}' target='_blank' class='btn btn-primary'>Add to Google Calendar</a>
        <a href='{outlookCalendarUrl}' target='_blank' class='btn btn-secondary'>Add to Outlook Calendar</a>
    </div>

    <p style='margin-top: 30px; font-size: 0.85em; color: #94a3b8;'>Best regards,<br/>Recruitment Platform HR Team</p>
</div>
</body>
</html>";

        await SendEmailAsync(candidateEmail, subject, bodyHtml);
        await SendSmsAsync(candidateEmail, $"Hi {candidateName}, your interview for {jobTitle} is set for {scheduledTimeText}. Join: {meetingLink}");
    }
}
