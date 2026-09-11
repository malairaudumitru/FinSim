using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Models.ScenarioHistory;

public class ScenarioHistoryCreateDto
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public int ScenarioId { get; set; }

    [Required]
    [Range(0, 100)]
    public int Scor { get; set; }
}
