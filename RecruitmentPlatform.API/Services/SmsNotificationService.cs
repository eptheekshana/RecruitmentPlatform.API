using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace RecruitmentPlatform.API.Services;

public class SmsNotificationService
{
    private readonly IConfiguration _config;
    private readonly ILogger<SmsNotificationService> _logger;

    public SmsNotificationService(IConfiguration config, ILogger<SmsNotificationService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendSmsAsync(string recipientPhoneNumber, string message)
    {
        _logger.LogInformation("\n=== [SMS NOTIFICATION DISPATCHED] ===\nTo Phone/Recipient: {Phone}\nMessage: {Message}\n==========================================", recipientPhoneNumber, message);
        await Task.CompletedTask;
    }
}
