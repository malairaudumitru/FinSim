namespace FinSim.Domain.Models.Notifications;

public class NotificationInfoDto
{
    public int Id { get; set; }
    public string Tip { get; set; } = string.Empty;
    public string Mesaj { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool Citit { get; set; }
    public string Email { get; set; } = string.Empty;
    public bool IsDeleted { get; set; }
}