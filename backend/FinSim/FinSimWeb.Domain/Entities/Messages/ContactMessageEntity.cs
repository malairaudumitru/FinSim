using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Entities.Messages;

public class ContactMessageEntity
{
    public int Id { get; set; }

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

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool Citit { get; set; } = false;

    [StringLength(1000)]
    public string? Raspuns { get; set; }

    public DateTime? RaspunsData { get; set; }

    public bool IsDeleted { get; set; } = false;
}
