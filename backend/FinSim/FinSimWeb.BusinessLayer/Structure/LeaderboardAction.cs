using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Leaderboard;
using FinSim.Domain.Models.Leaderboard;
using Microsoft.EntityFrameworkCore;

namespace FinSim.BusinessLayer.Structure;

public class LeaderboardAction
{
    protected readonly AppDbContext _context;

    public LeaderboardAction(AppDbContext context)
    {
        _context = context;
    }

    protected async Task<List<LeaderboardInfoDto>> GetLeaderboardListActionAsync()
    {
        return await _context.Leaderboard
            .Where(x => x.IsDeleted == false)
            .OrderByDescending(x => x.Score)
            .Select(leaderboardEntity => MapToInfoDto(leaderboardEntity))
            .ToListAsync();
    }

    protected async Task<bool> DeleteLeaderboardEntryActionAsync(int id)
    {
        var leaderboardEntity = await _context.Leaderboard.FirstOrDefaultAsync(x => x.Id == id);
        if (leaderboardEntity == null)
            return false;

        try
        {
            leaderboardEntity.IsDeleted = true;
            _context.Leaderboard.Update(leaderboardEntity);
            await _context.SaveChangesAsync();
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
