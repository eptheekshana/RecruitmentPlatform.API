// Represents candidate evaluation records within the recruitment system.

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RecruitmentPlatform.API.Entities;

public class Evaluation
{
    [Key]
    public int EvaluationId { get; set; }

    [Required]
    public int ApplicationId { get; set; }
    
    [ForeignKey("ApplicationId")]
    public Application? Application { get; set; }

    [Required]
    public int EvaluatorId { get; set; }

    [ForeignKey("EvaluatorId")]
    public User? Evaluator { get; set; }

    [Range(1, 10)]
    public int Score { get; set; }

    public string Comments { get; set; } = string.Empty;

    [Required]
    public string Recommendation { get; set; } = "Pending"; // Recommended, Rejected, Pending Interview

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
