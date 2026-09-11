using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Models.Leaderboard;

public class LeaderboardCreateDto
{
    [Required]
    [StringLength(15)]
    public string Nume { get; set; } = string.Empty;
    
    [Required]
    [StringLength(15)]
    public string Prenume { get; set; } = string.Empty;
    
    public int Scor { get; set; }
    
    public int? UserId { get; set; }
}