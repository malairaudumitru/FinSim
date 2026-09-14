using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.ScenarioHistory;
using FinSim.Domain.Models.ScenarioHistory;

namespace FinSim.BusinessLayer.Structure;

public class ScenarioHistoryAction
{
    private readonly ScenarioHistoryDbContext _context = new();

    protected bool CreateScenarioHistoryAction(ScenarioHistoryCreateDto data)
    {
        var scenarioHistoryEntity = new ScenarioHistoryEntity
        {
            UserId = data.UserId,
            ScenarioId = data.ScenarioId,
            Scor = data.Scor
        };

        try
        {
            _context.Add(scenarioHistoryEntity);
            _context.SaveChanges();
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

    protected bool UpdateScenarioHistoryAction(int id, ScenarioHistoryCreateDto data)
    {
        var scenarioHistoryEntity = _context.ScenarioHistories.Find(id);
        if (scenarioHistoryEntity == null || scenarioHistoryEntity.IsDeleted)
            return false;

        scenarioHistoryEntity.UserId = data.UserId;
        scenarioHistoryEntity.ScenarioId = data.ScenarioId;
        scenarioHistoryEntity.Scor = data.Scor;

        try
        {
            _context.ScenarioHistories.Update(scenarioHistoryEntity);
            _context.SaveChanges();
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
            return true;
        }
        catch (Exception)
        {
            return false;
        }
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
