using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Leaderboard;
using FinSim.Domain.Entities.ScenarioHistory;
using FinSim.Domain.Models.ScenarioHistory;
using Microsoft.EntityFrameworkCore;

namespace FinSim.BusinessLayer.Structure;

public class ScenarioHistoryAction
{
    protected readonly AppDbContext _context;

    public ScenarioHistoryAction(AppDbContext context)
    {
        _context = context;
    }

    protected async Task<bool> CreateScenarioHistoryActionAsync(int userId, ScenarioHistoryCreateDto data)
    {
        var scenarioHistoryEntity = new ScenarioHistoryEntity
        {
            UserId = userId,
            ScenarioId = data.ScenarioId,
            Score = data.Score
        };

        try
        {
            _context.Add(scenarioHistoryEntity);
            await _context.SaveChangesAsync();
            await RecalculateLeaderboardEntryAsync(userId);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<List<ScenarioHistoryInfoDto>> GetScenarioHistoryListActionAsync()
    {
        return await _context.ScenarioHistories
            .Where(x => x.IsDeleted == false)
            .OrderBy(x => x.CreatedAt)
            .Select(scenarioHistoryEntity => MapToInfoDto(scenarioHistoryEntity))
            .ToListAsync();
    }

    protected async Task<List<ScenarioHistoryInfoDto>> GetScenarioHistoryByUserIdActionAsync(int userId)
    {
        return await _context.ScenarioHistories
            .Where(x => x.UserId == userId && x.IsDeleted == false)
            .OrderBy(x => x.CreatedAt)
            .Select(scenarioHistoryEntity => MapToInfoDto(scenarioHistoryEntity))
            .ToListAsync();
    }

    protected async Task<bool> UpdateScenarioHistoryActionAsync(int id, ScenarioHistoryUpdateDto data)
    {
        var scenarioHistoryEntity = await _context.ScenarioHistories.FirstOrDefaultAsync(x => x.Id == id);
        if (scenarioHistoryEntity == null || scenarioHistoryEntity.IsDeleted)
            return false;

        var previousUserId = scenarioHistoryEntity.UserId;

        scenarioHistoryEntity.UserId = data.UserId;
        scenarioHistoryEntity.ScenarioId = data.ScenarioId;
        scenarioHistoryEntity.Score = data.Score;

        try
        {
            _context.ScenarioHistories.Update(scenarioHistoryEntity);
            await _context.SaveChangesAsync();
            await RecalculateLeaderboardEntryAsync(data.UserId);
            if (previousUserId != data.UserId)
                await RecalculateLeaderboardEntryAsync(previousUserId);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<bool> DeleteScenarioHistoryActionAsync(int id)
    {
        var scenarioHistoryEntity = await _context.ScenarioHistories.FirstOrDefaultAsync(x => x.Id == id);
        if (scenarioHistoryEntity == null)
            return false;

        try
        {
            scenarioHistoryEntity.IsDeleted = true;
            _context.ScenarioHistories.Update(scenarioHistoryEntity);
            await _context.SaveChangesAsync();
            await RecalculateLeaderboardEntryAsync(scenarioHistoryEntity.UserId);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private async Task RecalculateLeaderboardEntryAsync(int userId)
    {
        var totalScore = await _context.ScenarioHistories
            .Where(x => x.UserId == userId && x.IsDeleted == false)
            .SumAsync(x => x.Score);

        var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);
        if (user == null)
            return;

        var leaderboardEntity = await _context.Leaderboard.FirstOrDefaultAsync(x => x.UserId == userId);

        if (leaderboardEntity == null)
        {
            _context.Add(new LeaderboardEntity
            {
                LastName = user.LastName,
                FirstName = user.FirstName,
                Score = totalScore,
                UserId = userId
            });
        }
        else
        {
            leaderboardEntity.LastName = user.LastName;
            leaderboardEntity.FirstName = user.FirstName;
            leaderboardEntity.Score = totalScore;
            _context.Leaderboard.Update(leaderboardEntity);
        }

        await _context.SaveChangesAsync();
    }

    private static ScenarioHistoryInfoDto MapToInfoDto(ScenarioHistoryEntity scenarioHistoryEntity) => new()
    {
        Id = scenarioHistoryEntity.Id,
        UserId = scenarioHistoryEntity.UserId,
        ScenarioId = scenarioHistoryEntity.ScenarioId,
        Score = scenarioHistoryEntity.Score,
        CreatedAt = scenarioHistoryEntity.CreatedAt,
        IsDeleted = scenarioHistoryEntity.IsDeleted
    };
}
