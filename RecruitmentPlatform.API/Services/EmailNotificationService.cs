using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace RecruitmentPlatform.API.Services;

public class EmailNotificationService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailNotificationService> _logger;

    public EmailNotificationService(IConfiguration config, ILogger<EmailNotificationService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendEmailAsync(string recipientEmail, string subject, string bodyHtml)
    {
        var smtpHost = _config["NotificationSettings:Smtp:Host"];
        var smtpPortStr = _config["NotificationSettings:Smtp:Port"];
        var senderEmail = _config["NotificationSettings:Smtp:SenderEmail"] ?? "no-reply@recruitmentplatform.com";
        var senderPassword = _config["NotificationSettings:Smtp:SenderPassword"];

        if (!string.IsNullOrEmpty(smtpHost) && int.TryParse(smtpPortStr, out int smtpPort) && !string.IsNullOrEmpty(senderPassword))
        {
            try
            {
                using var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail, "Recruitment Platform"),
                    Subject = subject,
                    Body = bodyHtml,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(recipientEmail);

                using var smtpClient = new SmtpClient(smtpHost, smtpPort)
                {
                    Credentials = new NetworkCredential(senderEmail, senderPassword),
                    EnableSsl = true
                };

                await smtpClient.SendMailAsync(mailMessage);
                _logger.LogInformation("Email successfully sent via SMTP to {Recipient}", recipientEmail);
                return;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to dispatch SMTP email to {Recipient}. Falling back to logger output.", recipientEmail);
            }
        }

        _logger.LogInformation("\n=== [EMAIL NOTIFICATION DISPATCHED] ===\nTo: {Recipient}\nSubject: {Subject}\nContent:\n{Body}\n=============================================", recipientEmail, subject, bodyHtml);
    }
}
