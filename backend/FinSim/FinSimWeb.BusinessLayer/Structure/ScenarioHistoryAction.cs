using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Leaderboard;
using FinSim.Domain.Entities.ScenarioHistory;
using FinSim.Domain.Models.ScenarioHistory;

namespace FinSim.BusinessLayer.Structure;

public class ScenarioHistoryAction
{
    protected readonly AppDbContext _context;

    public ScenarioHistoryAction(AppDbContext context)
    {
        _context = context;
    }

    protected bool CreateScenarioHistoryAction(int userId, ScenarioHistoryCreateDto data)
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
            _context.SaveChanges();
            RecalculateLeaderboardEntry(userId);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected List<ScenarioHistoryInfoDto> GetScenarioHistoryListAction()
    {
        return _context.ScenarioHistories
            .Where(x => x.IsDeleted == false)
            .OrderBy(x => x.CreatedAt)
            .Select(scenarioHistoryEntity => MapToInfoDto(scenarioHistoryEntity))
            .ToList();
    }

    protected List<ScenarioHistoryInfoDto> GetScenarioHistoryByUserIdAction(int userId)
    {
        return _context.ScenarioHistories
            .Where(x => x.UserId == userId && x.IsDeleted == false)
            .OrderBy(x => x.CreatedAt)
            .Select(scenarioHistoryEntity => MapToInfoDto(scenarioHistoryEntity))
            .ToList();
    }

    protected bool UpdateScenarioHistoryAction(int id, ScenarioHistoryUpdateDto data)
    {
        var scenarioHistoryEntity = _context.ScenarioHistories.Find(id);
        if (scenarioHistoryEntity == null || scenarioHistoryEntity.IsDeleted)
            return false;

        var previousUserId = scenarioHistoryEntity.UserId;

        scenarioHistoryEntity.UserId = data.UserId;
        scenarioHistoryEntity.ScenarioId = data.ScenarioId;
        scenarioHistoryEntity.Score = data.Score;

        try
        {
            _context.ScenarioHistories.Update(scenarioHistoryEntity);
            _context.SaveChanges();
            RecalculateLeaderboardEntry(data.UserId);
            if (previousUserId != data.UserId)
                RecalculateLeaderboardEntry(previousUserId);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected bool DeleteScenarioHistoryAction(int id)
    {
        var scenarioHistoryEntity = _context.ScenarioHistories.Find(id);
        if (scenarioHistoryEntity == null)
            return false;

        try
        {
            scenarioHistoryEntity.IsDeleted = true;
            _context.ScenarioHistories.Update(scenarioHistoryEntity);
            _context.SaveChanges();
            RecalculateLeaderboardEntry(scenarioHistoryEntity.UserId);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private void RecalculateLeaderboardEntry(int userId)
    {
        var totalScore = _context.ScenarioHistories
            .Where(x => x.UserId == userId && x.IsDeleted == false)
            .Sum(x => x.Score);

        var user = _context.Users.Find(userId);
        if (user == null)
            return;

        var leaderboardEntity = _context.Leaderboard.FirstOrDefault(x => x.UserId == userId);

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

        _context.SaveChanges();
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
