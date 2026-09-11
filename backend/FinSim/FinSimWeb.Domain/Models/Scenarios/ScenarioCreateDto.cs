using System.ComponentModel.DataAnnotations;

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

    [Required]
    [StringLength(30)]
    public string Dificultate { get; set; } = string.Empty;

    public decimal SoldInitial { get; set; }

    public bool NecesitaCont { get; set; } = false;

    public int? ScorCreditInitial { get; set; }
    
    [Required]
    public string PasiJson { get; set; } = "[]";
}