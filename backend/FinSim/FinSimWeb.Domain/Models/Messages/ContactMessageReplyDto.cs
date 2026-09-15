using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Models.Messages;

public class ContactMessageReplyDto
{
    [Required]
    [StringLength(1000)]
    public string Reply { get; set; } = string.Empty;
}
