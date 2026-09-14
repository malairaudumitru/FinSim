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
    public string Nume { get; set; } = string.Empty;

    [Required]
    [StringLength(600)]
    public string Descriere { get; set; } = string.Empty;

    [EnumDataType(typeof(ScenarioDifficulty))]
    public ScenarioDifficulty Dificultate { get; set; } = ScenarioDifficulty.Usor;

    public decimal SoldInitial { get; set; }

    public bool NecesitaCont { get; set; } = false;

    public int? ScorCreditInitial { get; set; }

    public int? StresInitial { get; set; }

    [Required]
    public string PasiJson { get; set; } = "[]";
}