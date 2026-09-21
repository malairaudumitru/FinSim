using System.ComponentModel.DataAnnotations;
using FinSim.Domain.Entities.User;

namespace FinSim.Domain.Entities.Notifications;

public class NotificationEntity
{
    public int Id { get; set; }

    public NotificationType Type { get; set; } = NotificationType.System;

    [Required]
    [StringLength(300)]
    public string MessageRo { get; set; } = string.Empty;

    [StringLength(300)]
    public string? MessageEn { get; set; }

    [StringLength(300)]
    public string? MessageRu { get; set; }
    

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsRead { get; set; } = false;

    [Required]
    public int UserId { get; set; }

    public int? ContactMessageId { get; set; }

    public bool IsDeleted { get; set; } = false;

    public UserEntity? User { get; set; }
}