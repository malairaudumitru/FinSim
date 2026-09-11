namespace FinSim.Domain.Models.Reviews;

public class ReviewInfoDto
{
    public int Id { get; set; }
    public string Nume { get; set; } = string.Empty;
    public int? Varsta { get; set; }
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int Rating { get; set; }
    public string Mesaj { get; set; } = string.Empty;
    public bool IsDeleted { get; set; }
}