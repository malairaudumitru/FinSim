namespace FinSim.Domain.Models.Messages;

public class ContactMessageInfoDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public int UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
    public string? Reply { get; set; }
    public DateTime? ReplyDate { get; set; }
    public bool IsDeleted { get; set; }
}
