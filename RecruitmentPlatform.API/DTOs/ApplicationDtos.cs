using System;
using System.ComponentModel.DataAnnotations;

namespace RecruitmentPlatform.API.DTOs;

public class CreateApplicationDto
{
    [Required]
    public int JobId { get; set; }
    public string CoverLetter { get; set; } = string.Empty;
}

public class UpdateApplicationStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty; // "Applied", "Under Review", "Shortlisted", "Rejected", "Hired"
}

public class ApplicationResponseDto
{
    public int ApplicationId { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal AIScore { get; set; }
    public DateTime AppliedDate { get; set; }
    public string CoverLetter { get; set; } = string.Empty;
    public int CandidateId { get; set; }
    public string CandidateName { get; set; } = string.Empty;
    public string CandidateEmail { get; set; } = string.Empty;
    public int JobId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
}
