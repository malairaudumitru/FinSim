namespace FinSim.Domain.Models.Leaderboard;

public class LeaderboardInfoDto
{
    public int Id { get; set; }
    public string LastName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public int Score { get; set; }
    public int UserId { get; set; }
    public bool IsDeleted { get; set; }
}