using System.ComponentModel.DataAnnotations;
using FinSim.Domain.Entities.ScenarioHistory;

namespace FinSim.Domain.Entities.Scenarios;

public class ScenarioEntity
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Slug { get; set; } = string.Empty;

    [Required]
    [StringLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(600)]
    public string Description { get; set; } = string.Empty;

    public ScenarioDifficulty Difficulty { get; set; } = ScenarioDifficulty.Easy;

    public decimal InitialBalance { get; set; }

    public bool RequiresAccount { get; set; } = false;

    public int? InitialCreditScore { get; set; }

    public int? InitialStress { get; set; }

    [Required]
    public string StepsJson { get; set; } = "[]";

    public bool IsDeleted { get; set; } = false;

    public ICollection<ScenarioHistoryEntity> Histories { get; set; } = new List<ScenarioHistoryEntity>();
}