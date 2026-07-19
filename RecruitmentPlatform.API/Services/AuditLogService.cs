using System;
using System.Threading.Tasks;
using RecruitmentPlatform.API.Data;
using RecruitmentPlatform.API.Entities;

namespace RecruitmentPlatform.API.Services;

public class AuditLogService
{
    private readonly ApplicationDbContext _dbContext;

    public AuditLogService(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task LogAsync(string action, string details, int? userId = null)
    {
        var log = new AuditLog
        {
            Action = action,
            Details = details,
            UserId = userId,
            Timestamp = DateTime.UtcNow
        };

        _dbContext.AuditLogs.Add(log);
        await _dbContext.SaveChangesAsync();
    }
}
