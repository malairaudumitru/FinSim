using System.ComponentModel.DataAnnotations;
using FinSim.Domain.Entities.Notifications;

namespace FinSim.Domain.Models.Notifications;

public class NotificationCreateDto
{
    [EnumDataType(typeof(NotificationType))]
    public NotificationType Type { get; set; } = NotificationType.System;

    [Required]
    [StringLength(300)]
    public string Message { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(150)]
    public string Email { get; set; } = string.Empty;
}