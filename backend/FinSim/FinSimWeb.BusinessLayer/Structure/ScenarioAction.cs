using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Scenarios;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.Scenarios;

namespace FinSim.BusinessLayer.Structure;

public class ScenarioAction
{
    private readonly ScenarioDbContext _context = new();

    protected bool CreateScenarioAction(ScenarioCreateDto data)
    {
        var validate = ValidateScenario(data);
        if (!validate.IsSuccess)
            return false;

        var scenarioEntity = new ScenarioEntity
        {
            Slug = data.Slug,
            Nume = data.Nume,
            Descriere = data.Descriere,
            Dificultate = data.Dificultate,
            SoldInitial = data.SoldInitial,
            NecesitaCont = data.NecesitaCont,
            ScorCreditInitial = data.ScorCreditInitial,
            StresInitial = data.StresInitial,
            PasiJson = data.PasiJson
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
        if (string.IsNullOrEmpty(data.Nume))
            return new ActionResponse { IsSuccess = false, Message = "Nume is empty" };
        if (string.IsNullOrEmpty(data.Descriere))
            return new ActionResponse { IsSuccess = false, Message = "Descriere is empty" };

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
        scenarioEntity.Nume = data.Nume;
        scenarioEntity.Descriere = data.Descriere;
        scenarioEntity.Dificultate = data.Dificultate;
        scenarioEntity.SoldInitial = data.SoldInitial;
        scenarioEntity.NecesitaCont = data.NecesitaCont;
        scenarioEntity.ScorCreditInitial = data.ScorCreditInitial;
        scenarioEntity.StresInitial = data.StresInitial;
        scenarioEntity.PasiJson = data.PasiJson;

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
        Nume = scenarioEntity.Nume,
        Descriere = scenarioEntity.Descriere,
        Dificultate = scenarioEntity.Dificultate,
        SoldInitial = scenarioEntity.SoldInitial,
        NecesitaCont = scenarioEntity.NecesitaCont,
        ScorCreditInitial = scenarioEntity.ScorCreditInitial,
        StresInitial = scenarioEntity.StresInitial,
        PasiJson = scenarioEntity.PasiJson,
        IsDeleted = scenarioEntity.IsDeleted
    };
}
