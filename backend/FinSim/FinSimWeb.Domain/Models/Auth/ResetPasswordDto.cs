using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Models.Auth;

public class ResetPasswordDto
{
    [Required]
    [EmailAddress]
    [StringLength(50)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(6, MinimumLength = 6)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 8)]
    public string NewPassword { get; set; } = string.Empty;
}
