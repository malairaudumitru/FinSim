namespace FinSim.Domain.Models.Reviews;

public class ReviewInfoDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int Rating { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool IsDeleted { get; set; }
}