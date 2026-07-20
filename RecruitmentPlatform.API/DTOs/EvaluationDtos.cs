/*
 * Evaluation DTOs
 * ----------------
 * These Data Transfer Objects are used to handle candidate evaluation data.
 * CreateEvaluationDto is used when a Hiring Manager submits an evaluation,
 * including score, comments, and recommendation. EvaluationResponseDto is
 * returned to clients when evaluation details are retrieved from the system.
 */
 
using System;
using System.ComponentModel.DataAnnotations;

namespace RecruitmentPlatform.API.DTOs;

public class CreateEvaluationDto
{
    [Required]
    public int ApplicationId { get; set; }

    [Required]
    [Range(1, 10, ErrorMessage = "Score must be between 1 and 10.")]
    public int Score { get; set; }

    [Required]
    public string Comments { get; set; } = string.Empty;

    [Required]
    public string Recommendation { get; set; } = "Pending"; // Recommended, Rejected, Pending Interview
}

public class EvaluationResponseDto
{
    public int EvaluationId { get; set; }
    public int ApplicationId { get; set; }
    public int EvaluatorId { get; set; }
    public string EvaluatorName { get; set; } = string.Empty;
    public int Score { get; set; }
    public string Comments { get; set; } = string.Empty;
    public string Recommendation { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
}
