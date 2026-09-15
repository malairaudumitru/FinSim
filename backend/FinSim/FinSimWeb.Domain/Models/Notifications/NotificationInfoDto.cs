using FinSim.Domain.Entities.Notifications;

namespace FinSim.Domain.Models.Notifications;

public class NotificationInfoDto
{
    public int Id { get; set; }
    public NotificationType Type { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
    public int UserId { get; set; }
    public bool IsDeleted { get; set; }
}