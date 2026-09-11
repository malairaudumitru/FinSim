using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Models.User;

public class UserLoginDto
{
    [Required]
    [EmailAddress]
    [StringLength(50)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;
}