/* Administration and Analytics DTOs
 * ---------------------------------
 * These DTOs support administrative operations such as user role management,
 * user listing, audit log retrieval, and analytics dashboard reporting.
 * They provide structured data for communication between the API and the
 * administrative interface.
 */
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RecruitmentPlatform.API.DTOs;

public class UpdateUserRoleDto
{
    [Required]
    public string Role { get; set; } = "Candidate";
}

public class AdminUserResponseDto
{
    public int UserId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int? OrganizationId { get; set; }
    public string OrganizationName { get; set; } = string.Empty;
}

public class AnalyticsDashboardDto
{
    public int TotalApplications { get; set; }
    public int TotalJobPostings { get; set; }
    public int TotalCandidates { get; set; }
    public int TotalUsers { get; set; }
    public decimal AverageAIScore { get; set; }
    public List<StatusCountDto> ApplicationsByStatus { get; set; } = new();
    public List<DepartmentCountDto> JobsByDepartment { get; set; } = new();
    public List<AuditLogResponseDto> RecentLogs { get; set; } = new();
}

public class StatusCountDto
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class DepartmentCountDto
{
    public string Department { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class AuditLogResponseDto
{
    public int AuditLogId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string UserEmail { get; set; } = string.Empty;
}
