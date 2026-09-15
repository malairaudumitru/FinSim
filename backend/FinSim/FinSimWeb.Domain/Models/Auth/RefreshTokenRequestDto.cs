using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Models.Auth;

public class RefreshTokenRequestDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
