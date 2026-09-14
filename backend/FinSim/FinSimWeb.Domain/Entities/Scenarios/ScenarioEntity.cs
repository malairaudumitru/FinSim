using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Entities.Scenarios;

public class ScenarioEntity
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Slug { get; set; } = string.Empty;

    [Required]
    [StringLength(150)]
    public string Nume { get; set; } = string.Empty;

    [Required]
    [StringLength(600)]
    public string Descriere { get; set; } = string.Empty;

    public ScenarioDifficulty Dificultate { get; set; } = ScenarioDifficulty.Usor;

    public decimal SoldInitial { get; set; }

    public bool NecesitaCont { get; set; } = false;

    public int? ScorCreditInitial { get; set; }

    public int? StresInitial { get; set; }

    [Required]
    public string PasiJson { get; set; } = "[]";

    public bool IsDeleted { get; set; } = false;
}