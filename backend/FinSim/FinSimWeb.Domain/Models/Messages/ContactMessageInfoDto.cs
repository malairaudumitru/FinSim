namespace FinSim.Domain.Models.Messages;

public class ContactMessageInfoDto
{
    public int Id { get; set; }
    public string Nume { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Mesaj { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool Citit { get; set; }
    public string? Raspuns { get; set; }
    public DateTime? RaspunsData { get; set; }
    public bool IsDeleted { get; set; }
}
