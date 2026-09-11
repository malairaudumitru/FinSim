namespace FinSim.Domain.Models.Leaderboard;

public class LeaderboardInfoDto
{
    public int Id { get; set; }
    public string Nume { get; set; } = string.Empty;
    public string Prenume { get; set; } = string.Empty;
    public int Scor { get; set; }
    public int UserId { get; set; }
}