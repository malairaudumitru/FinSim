using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Models.User;

public class UserRegisterDto
{
    [Required]
    [StringLength(15)]
    public string Nume { get; set; } = string.Empty;
    
    [Required]
    [StringLength(15)]
    public string Prenume { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    [StringLength(50)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [StringLength(50, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;
    
    [Range(1, 31)]
    public int? Zi { get; set; }
    
    [Range(1, 12)]
    public int? Luna { get; set; }
    
    public int? An { get; set; }
}