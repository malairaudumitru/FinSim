namespace FinSim.Domain.Models.Scenarios;

public class ScenarioInfoDto
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Nume { get; set; } = string.Empty;
    public string Descriere { get; set; } = string.Empty;
    public string Dificultate { get; set; } = string.Empty;
    public decimal SoldInitial { get; set; }
    public bool NecesitaCont { get; set; }
    public int? ScorCreditInitial { get; set; }
    public string PasiJson { get; set; } = "[]";
    public bool IsDeleted { get; set; }
}