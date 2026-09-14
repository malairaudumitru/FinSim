using FinSim.Domain.Entities.Scenarios;

namespace FinSim.Domain.Models.Scenarios;

public class ScenarioInfoDto
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Nume { get; set; } = string.Empty;
    public string Descriere { get; set; } = string.Empty;
    public ScenarioDifficulty Dificultate { get; set; }
    public decimal SoldInitial { get; set; }
    public bool NecesitaCont { get; set; }
    public int? ScorCreditInitial { get; set; }
    public int? StresInitial { get; set; }
    public string PasiJson { get; set; } = "[]";
    public bool IsDeleted { get; set; }
}