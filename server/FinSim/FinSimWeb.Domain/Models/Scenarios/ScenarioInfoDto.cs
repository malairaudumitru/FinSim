using FinSim.Domain.Entities.Scenarios;

namespace FinSim.Domain.Models.Scenarios;

public class ScenarioInfoDto
{
    public int Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    /// <summary>Name in the language requested through Accept-Language.</summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>Description in the language requested through Accept-Language.</summary>
    public string Description { get; set; } = string.Empty;
    public string NameRo { get; set; } = string.Empty;
    public string? NameEn { get; set; }
    public string? NameRu { get; set; }
    public string DescriptionRo { get; set; } = string.Empty;
    public string? DescriptionEn { get; set; }
    public string? DescriptionRu { get; set; }
    public ScenarioDifficulty Difficulty { get; set; }
    public decimal InitialBalance { get; set; }
    public bool RequiresAccount { get; set; }
    public int? InitialCreditScore { get; set; }
    public int? InitialStress { get; set; }
    /// <summary>Steps with every text already reduced to the requested language.</summary>
    public string StepsJson { get; set; } = "[]";
    /// <summary>Steps with all languages, only filled for administrators (used by the admin editor).</summary>
    public string? StepsJsonRaw { get; set; }
    public bool IsDeleted { get; set; }
}