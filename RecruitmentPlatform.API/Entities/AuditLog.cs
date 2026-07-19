using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecruitmentPlatform.API.Entities;

public class AuditLog
{
    [Key]
    public int AuditLogId { get; set; }

    [Required]
    public string Action { get; set; } = string.Empty;

    public string Details { get; set; } = string.Empty;

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    [ForeignKey("User")]
    public int? UserId { get; set; }
    public User? User { get; set; }
}
