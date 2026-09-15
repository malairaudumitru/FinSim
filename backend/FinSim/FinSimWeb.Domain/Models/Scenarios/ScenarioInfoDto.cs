using FinSim.Domain.Entities.Scenarios;

namespace FinSim.Domain.Models.Scenarios;

public class ScenarioInfoDto
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ScenarioDifficulty Difficulty { get; set; }
    public decimal InitialBalance { get; set; }
    public bool RequiresAccount { get; set; }
    public int? InitialCreditScore { get; set; }
    public int? InitialStress { get; set; }
    public string StepsJson { get; set; } = "[]";
    public bool IsDeleted { get; set; }
}