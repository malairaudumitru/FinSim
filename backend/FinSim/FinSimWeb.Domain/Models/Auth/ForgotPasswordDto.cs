using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Models.Auth;

public class ForgotPasswordDto
{
    [Required]
    [EmailAddress]
    [StringLength(50)]
    public string Email { get; set; } = string.Empty;
}
