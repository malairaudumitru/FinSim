using System.ComponentModel.DataAnnotations;
using FinSim.Domain.Entities.Scenarios;

namespace FinSim.Domain.Models.Scenarios;

public class ScenarioCreateDto
{
    [Required]
    [StringLength(100)]
    public string Slug { get; set; } = string.Empty;

    [Required]
    [StringLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(600)]
    public string Description { get; set; } = string.Empty;

    [EnumDataType(typeof(ScenarioDifficulty))]
    public ScenarioDifficulty Difficulty { get; set; } = ScenarioDifficulty.Easy;

    public decimal InitialBalance { get; set; }

    public bool RequiresAccount { get; set; } = false;

    public int? InitialCreditScore { get; set; }

    public int? InitialStress { get; set; }

    [Required]
    public string StepsJson { get; set; } = "[]";
}