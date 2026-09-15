using System.ComponentModel.DataAnnotations;
using FinSim.Domain.Entities.User;

namespace FinSim.Domain.Entities.Messages;

public class ContactMessageEntity
{
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(1000, MinimumLength = 25)]
    public string Message { get; set; } = string.Empty;

    [Required]
    public int UserId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsRead { get; set; } = false;

    [StringLength(1000)]
    public string? Reply { get; set; }

    public DateTime? ReplyDate { get; set; }

    public bool IsDeleted { get; set; } = false;

    public UserEntity? User { get; set; }
}
