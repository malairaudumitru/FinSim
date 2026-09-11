using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Models.Messages;

public class ContactMessageCreateDto
{
    [Required]
    [StringLength(50)]
    public string Nume { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(1000)]
    public string Mesaj { get; set; } = string.Empty;
}
