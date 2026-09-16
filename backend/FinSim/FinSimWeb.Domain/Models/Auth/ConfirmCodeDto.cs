using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Models.Auth;

public class ConfirmCodeDto
{
    [Required]
    [StringLength(6, MinimumLength = 6)]
    public string Code { get; set; } = string.Empty;
}
