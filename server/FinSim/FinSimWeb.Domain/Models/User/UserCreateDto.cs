using System.ComponentModel.DataAnnotations;
using FinSim.Domain.Entities.User;

namespace FinSim.Domain.Models.User;

public class UserCreateDto
{
    [Required]
    [StringLength(15)]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    [StringLength(15)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(50)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [StringLength(50, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;

    [EnumDataType(typeof(UserRole))]
    public UserRole Role { get; set; } = UserRole.User;

    [EnumDataType(typeof(UserStatus))]
    public UserStatus Status { get; set; } = UserStatus.Active;
    
    public int CompletedScenarios { get; set; } = 0;
    
    public int TotalScore { get; set; } = 0;
    
    [Required]
    public DateOnly? BirthDate { get; set; }

}