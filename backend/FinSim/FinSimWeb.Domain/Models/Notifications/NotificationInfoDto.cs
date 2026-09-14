using FinSim.Domain.Entities.Notifications;

namespace FinSim.Domain.Models.Notifications;

public class NotificationInfoDto
{
    public int Id { get; set; }
    public NotificationType Tip { get; set; }
    public string Mesaj { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool Citit { get; set; }
    public int UserId { get; set; }
    public bool IsDeleted { get; set; }
}