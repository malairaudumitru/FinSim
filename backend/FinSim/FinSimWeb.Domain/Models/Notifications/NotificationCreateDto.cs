using System.ComponentModel.DataAnnotations;
using FinSim.Domain.Entities.Notifications;

namespace FinSim.Domain.Models.Notifications;

public class NotificationCreateDto
{
    [EnumDataType(typeof(NotificationType))]
    public NotificationType Tip { get; set; } = NotificationType.Sistem;

    [Required]
    [StringLength(300)]
    public string Mesaj { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(150)]
    public string Email { get; set; } = string.Empty;
}