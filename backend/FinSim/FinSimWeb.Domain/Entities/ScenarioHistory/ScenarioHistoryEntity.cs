using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Entities.ScenarioHistory;

public class ScenarioHistoryEntity
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public int ScenarioId { get; set; }

    [Required]
    [Range(0, 100)]
    public int Scor { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsDeleted { get; set; } = false;
}
