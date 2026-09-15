using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Scenarios;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.Scenarios;

namespace FinSim.BusinessLayer.Structure;

public class ScenarioAction
{
    protected readonly AppDbContext _context;

    public ScenarioAction(AppDbContext context)
    {
        _context = context;
    }

    protected bool CreateScenarioAction(ScenarioCreateDto data)
    {
        var validate = ValidateScenario(data);
        if (!validate.IsSuccess)
            return false;

        var scenarioEntity = new ScenarioEntity
        {
            Slug = data.Slug,
            Name = data.Name,
            Description = data.Description,
            Difficulty = data.Difficulty,
            InitialBalance = data.InitialBalance,
            RequiresAccount = data.RequiresAccount,
            InitialCreditScore = data.InitialCreditScore,
            InitialStress = data.InitialStress,
            StepsJson = data.StepsJson
        };

        try
        {
            _context.Add(scenarioEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private ActionResponse ValidateScenario(ScenarioCreateDto data, int? excludingId = null)
    {
        if (string.IsNullOrEmpty(data.Slug))
            return new ActionResponse { IsSuccess = false, Message = "Slug is empty" };
        if (string.IsNullOrEmpty(data.Name))
            return new ActionResponse { IsSuccess = false, Message = "Name is empty" };
        if (string.IsNullOrEmpty(data.Description))
            return new ActionResponse { IsSuccess = false, Message = "Description is empty" };

        var duplicate = _context.Scenarios.Any(s =>
            s.Slug == data.Slug && s.IsDeleted == false && s.Id != (excludingId ?? 0));
        if (duplicate)
            return new ActionResponse { IsSuccess = false, Message = "Slug already in use" };

        return new ActionResponse { IsSuccess = true };
    }

    protected ScenarioInfoDto? GetScenarioBySlugAction(string slug)
    {
        var scenarioEntity = _context.Scenarios
            .FirstOrDefault(x => x.Slug == slug && x.IsDeleted == false);
        if (scenarioEntity == null)
            return null;

        return MapToInfoDto(scenarioEntity);
    }

    protected List<ScenarioInfoDto> GetScenarioListAction()
    {
        return _context.Scenarios
            .Where(x => x.IsDeleted == false)
            .Select(scenarioEntity => MapToInfoDto(scenarioEntity))
            .ToList();
    }

    protected bool UpdateScenarioAction(int id, ScenarioCreateDto data)
    {
        var scenarioEntity = _context.Scenarios.Find(id);
        if (scenarioEntity == null || scenarioEntity.IsDeleted)
            return false;

        var validate = ValidateScenario(data, excludingId: id);
        if (!validate.IsSuccess)
            return false;

        scenarioEntity.Slug = data.Slug;
        scenarioEntity.Name = data.Name;
        scenarioEntity.Description = data.Description;
        scenarioEntity.Difficulty = data.Difficulty;
        scenarioEntity.InitialBalance = data.InitialBalance;
        scenarioEntity.RequiresAccount = data.RequiresAccount;
        scenarioEntity.InitialCreditScore = data.InitialCreditScore;
        scenarioEntity.InitialStress = data.InitialStress;
        scenarioEntity.StepsJson = data.StepsJson;

        try
        {
            _context.Scenarios.Update(scenarioEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected bool DeleteScenarioAction(int id)
    {
        var scenarioEntity = _context.Scenarios.Find(id);
        if (scenarioEntity == null)
            return false;

        try
        {
            scenarioEntity.IsDeleted = true;
            _context.Scenarios.Update(scenarioEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private static ScenarioInfoDto MapToInfoDto(ScenarioEntity scenarioEntity) => new()
    {
        Id = scenarioEntity.Id,
        Slug = scenarioEntity.Slug,
        Name = scenarioEntity.Name,
        Description = scenarioEntity.Description,
        Difficulty = scenarioEntity.Difficulty,
        InitialBalance = scenarioEntity.InitialBalance,
        RequiresAccount = scenarioEntity.RequiresAccount,
        InitialCreditScore = scenarioEntity.InitialCreditScore,
        InitialStress = scenarioEntity.InitialStress,
        StepsJson = scenarioEntity.StepsJson,
        IsDeleted = scenarioEntity.IsDeleted
    };
}
