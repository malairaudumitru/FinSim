using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Models.Messages;

public class ContactMessageCreateDto
{
    [Required]
    [StringLength(1000, MinimumLength = 25)]
    public string Mesaj { get; set; } = string.Empty;
}
