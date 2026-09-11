using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Models.Notifications;

public class NotificationCreateDto
{
    [Required]
    [StringLength(20)]
    public string Tip { get; set; } = "sistem";

    [Required]
    [StringLength(300)]
    public string Mesaj { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(150)]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}