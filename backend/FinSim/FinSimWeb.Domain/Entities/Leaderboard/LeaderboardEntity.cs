using System.ComponentModel.DataAnnotations;
using FinSim.Domain.Entities.User;

namespace FinSim.Domain.Entities.Leaderboard;

public class LeaderboardEntity
{
    public int Id { get; set; }

    [Required]
    [StringLength(15)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [StringLength(15)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public int Score { get; set; }

    [Required]
    public int UserId { get; set; }

    public bool IsDeleted { get; set; } = false;

    public UserEntity? User { get; set; }
}