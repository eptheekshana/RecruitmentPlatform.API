using System.ComponentModel.DataAnnotations;

namespace RecruitmentPlatform.API.Entities;

public class Organization
{
    [Key]
    public int OrganizationId { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;

    public ICollection<User> Employees { get; set; } = new List<User>();
}
