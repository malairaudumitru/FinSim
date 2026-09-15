using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Leaderboard;
using FinSim.Domain.Models.Leaderboard;

namespace FinSim.BusinessLayer.Structure;

public class LeaderboardAction
{
    protected readonly AppDbContext _context;

    public LeaderboardAction(AppDbContext context)
    {
        _context = context;
    }

    protected List<LeaderboardInfoDto> GetLeaderboardListAction()
    {
        return _context.Leaderboard
            .Where(x => x.IsDeleted == false)
            .OrderByDescending(x => x.Score)
            .Select(leaderboardEntity => MapToInfoDto(leaderboardEntity))
            .ToList();
    }

    protected bool DeleteLeaderboardEntryAction(int id)
    {
        var leaderboardEntity = _context.Leaderboard.Find(id);
        if (leaderboardEntity == null)
            return false;

        try
        {
            leaderboardEntity.IsDeleted = true;
            _context.Leaderboard.Update(leaderboardEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private static LeaderboardInfoDto MapToInfoDto(LeaderboardEntity leaderboardEntity) => new()
    {
        Id = leaderboardEntity.Id,
        LastName = leaderboardEntity.LastName,
        FirstName = leaderboardEntity.FirstName,
        Score = leaderboardEntity.Score,
        UserId = leaderboardEntity.UserId,
        IsDeleted = leaderboardEntity.IsDeleted
    };
}
