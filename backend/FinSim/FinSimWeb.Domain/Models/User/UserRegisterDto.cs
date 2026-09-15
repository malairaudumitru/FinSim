using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Models.User;

public class UserRegisterDto
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
    
    public DateOnly? BirthDate { get; set; }
}