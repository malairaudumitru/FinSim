using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Leaderboard;
using FinSim.Domain.Entities.ScenarioHistory;
using FinSim.Domain.Models.ScenarioHistory;

namespace FinSim.BusinessLayer.Structure;

public class ScenarioHistoryAction
{
    private readonly ScenarioHistoryDbContext _context = new();

    protected bool CreateScenarioHistoryAction(int userId, ScenarioHistoryCreateDto data)
    {
        var scenarioHistoryEntity = new ScenarioHistoryEntity
        {
            UserId = userId,
            ScenarioId = data.ScenarioId,
            Scor = data.Scor
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
        scenarioHistoryEntity.Scor = data.Scor;

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
        var totalScor = _context.ScenarioHistories
            .Where(x => x.UserId == userId && x.IsDeleted == false)
            .Sum(x => x.Scor);

        using var userContext = new UserDbContext();
        var user = userContext.Users.Find(userId);
        if (user == null)
            return;

        using var leaderboardContext = new LeaderboardDbContext();
        var leaderboardEntity = leaderboardContext.Leaderboard.FirstOrDefault(x => x.UserId == userId);

        if (leaderboardEntity == null)
        {
            leaderboardContext.Add(new LeaderboardEntity
            {
                Nume = user.Nume,
                Prenume = user.Prenume,
                Scor = totalScor,
                UserId = userId
            });
        }
        else
        {
            leaderboardEntity.Nume = user.Nume;
            leaderboardEntity.Prenume = user.Prenume;
            leaderboardEntity.Scor = totalScor;
            leaderboardContext.Leaderboard.Update(leaderboardEntity);
        }

        leaderboardContext.SaveChanges();
    }

    private static ScenarioHistoryInfoDto MapToInfoDto(ScenarioHistoryEntity scenarioHistoryEntity) => new()
    {
        Id = scenarioHistoryEntity.Id,
        UserId = scenarioHistoryEntity.UserId,
        ScenarioId = scenarioHistoryEntity.ScenarioId,
        Scor = scenarioHistoryEntity.Scor,
        CreatedAt = scenarioHistoryEntity.CreatedAt,
        IsDeleted = scenarioHistoryEntity.IsDeleted
    };
}
