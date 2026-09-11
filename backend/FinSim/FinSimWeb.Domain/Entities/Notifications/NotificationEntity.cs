using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Entities.Notifications;

public class NotificationEntity
{
    public int Id { get; set; }

    public NotificationType Tip { get; set; } = NotificationType.Sistem;

    [Required]
    [StringLength(300)]
    public string Mesaj { get; set; } = string.Empty;
    

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool Citit { get; set; } = false;

    [Required]
    public int UserId { get; set; }

    public bool IsDeleted { get; set; } = false;
}