using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Models.User;

public class UpdateUserStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty;
}
