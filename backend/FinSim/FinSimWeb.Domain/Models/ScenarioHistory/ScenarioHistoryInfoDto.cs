namespace FinSim.Domain.Models.ScenarioHistory;

public class ScenarioHistoryInfoDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ScenarioId { get; set; }
    public int Scor { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsDeleted { get; set; }
}
