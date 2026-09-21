using FinSim.Domain.Entities.Notifications;

namespace FinSim.Domain.Models.Notifications;

public class NotificationInfoDto
{
    public int Id { get; set; }
    public NotificationType Type { get; set; }
    /// <summary>Message in the language requested through Accept-Language.</summary>
    public string Message { get; set; } = string.Empty;
    public string MessageRo { get; set; } = string.Empty;
    public string? MessageEn { get; set; }
    public string? MessageRu { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
    public int UserId { get; set; }
    public int? ContactMessageId { get; set; }
    public bool IsDeleted { get; set; }
}