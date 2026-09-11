using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Entities.Leaderboard;

public class LeaderboardEntity
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(15)]
    public string Nume { get; set; } = string.Empty;
    
    [Required]
    [StringLength(15)]
    public string Prenume { get; set; } = string.Empty;
    
    [Required]
    public int Scor { get; set; }
    
    [Required]
    public int UserId { get; set; }
    
    public bool IsDeleted { get; set; } = false;
}