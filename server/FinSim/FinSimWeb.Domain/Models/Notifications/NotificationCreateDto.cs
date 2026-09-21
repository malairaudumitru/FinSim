using System.ComponentModel.DataAnnotations;
using FinSim.Domain.Entities.Notifications;

namespace FinSim.Domain.Models.Notifications;

public class NotificationCreateDto
{
    [EnumDataType(typeof(NotificationType))]
    public NotificationType Type { get; set; } = NotificationType.System;

    [Required]
    [StringLength(300)]
    public string MessageRo { get; set; } = string.Empty;

    [StringLength(300)]
    public string? MessageEn { get; set; }

    [StringLength(300)]
    public string? MessageRu { get; set; }

    /// <summary>Recipient account. Not needed when <see cref="SendToAll"/> is true.</summary>
    [EmailAddress]
    [StringLength(150)]
    public string? Email { get; set; }

    /// <summary>Creates the notification for every active user instead of a single recipient.</summary>
    public bool SendToAll { get; set; }
}