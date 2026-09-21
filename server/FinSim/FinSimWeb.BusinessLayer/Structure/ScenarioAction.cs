using FinSim.BusinessLayer.Core;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Scenarios;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.Scenarios;
using Microsoft.EntityFrameworkCore;

namespace FinSim.BusinessLayer.Structure;

public class ScenarioAction
{
    protected readonly AppDbContext _context;

    public ScenarioAction(AppDbContext context)
    {
        _context = context;
    }

    protected async Task<bool> CreateScenarioActionAsync(ScenarioCreateDto data)
    {
        var validate = await ValidateScenarioAsync(data);
        if (!validate.IsSuccess)
            return false;

        var scenarioEntity = new ScenarioEntity
        {
            Slug = data.Slug,
            NameRo = data.NameRo,
            NameEn = NullIfBlank(data.NameEn),
            NameRu = NullIfBlank(data.NameRu),
            DescriptionRo = data.DescriptionRo,
            DescriptionEn = NullIfBlank(data.DescriptionEn),
            DescriptionRu = NullIfBlank(data.DescriptionRu),
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
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private async Task<ActionResponse> ValidateScenarioAsync(ScenarioCreateDto data, int? excludingId = null)
    {
        if (string.IsNullOrEmpty(data.Slug))
            return new ActionResponse { IsSuccess = false, Message = "Slug is empty" };
        if (string.IsNullOrEmpty(data.NameRo))
            return new ActionResponse { IsSuccess = false, Message = "Name is empty" };
        if (string.IsNullOrEmpty(data.DescriptionRo))
            return new ActionResponse { IsSuccess = false, Message = "Description is empty" };

        var duplicate = await _context.Scenarios.AnyAsync(s =>
            s.Slug == data.Slug && s.IsDeleted == false && s.Id != (excludingId ?? 0));
        if (duplicate)
            return new ActionResponse { IsSuccess = false, Message = "Slug already in use" };

        return new ActionResponse { IsSuccess = true };
    }

    protected async Task<ScenarioInfoDto?> GetScenarioBySlugActionAsync(string slug, string language, bool isAdmin)
    {
        var scenarioEntity = await _context.Scenarios
            .FirstOrDefaultAsync(x => x.Slug == slug && x.IsDeleted == false);
        if (scenarioEntity == null)
            return null;

        return MapToInfoDto(scenarioEntity, language, isAdmin);
    }

    protected async Task<List<ScenarioInfoDto>> GetScenarioListActionAsync(string language, bool isAdmin)
    {
        return await _context.Scenarios
            .Where(x => x.IsDeleted == false)
            .Select(scenarioEntity => MapToInfoDto(scenarioEntity, language, isAdmin))
            .ToListAsync();
    }

    protected async Task<bool> UpdateScenarioActionAsync(int id, ScenarioCreateDto data)
    {
        var scenarioEntity = await _context.Scenarios.FirstOrDefaultAsync(x => x.Id == id);
        if (scenarioEntity == null || scenarioEntity.IsDeleted)
            return false;

        var validate = await ValidateScenarioAsync(data, excludingId: id);
        if (!validate.IsSuccess)
            return false;

        scenarioEntity.Slug = data.Slug;
        scenarioEntity.NameRo = data.NameRo;
        scenarioEntity.NameEn = NullIfBlank(data.NameEn);
        scenarioEntity.NameRu = NullIfBlank(data.NameRu);
        scenarioEntity.DescriptionRo = data.DescriptionRo;
        scenarioEntity.DescriptionEn = NullIfBlank(data.DescriptionEn);
        scenarioEntity.DescriptionRu = NullIfBlank(data.DescriptionRu);
        scenarioEntity.Difficulty = data.Difficulty;
        scenarioEntity.InitialBalance = data.InitialBalance;
        scenarioEntity.RequiresAccount = data.RequiresAccount;
        scenarioEntity.InitialCreditScore = data.InitialCreditScore;
        scenarioEntity.InitialStress = data.InitialStress;
        scenarioEntity.StepsJson = data.StepsJson;

        try
        {
            _context.Scenarios.Update(scenarioEntity);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<bool> DeleteScenarioActionAsync(int id)
    {
        var scenarioEntity = await _context.Scenarios.FirstOrDefaultAsync(x => x.Id == id);
        if (scenarioEntity == null)
            return false;

        try
        {
            scenarioEntity.IsDeleted = true;
            _context.Scenarios.Update(scenarioEntity);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private static string? NullIfBlank(string? value) => string.IsNullOrWhiteSpace(value) ? null : value;

    private static ScenarioInfoDto MapToInfoDto(ScenarioEntity scenarioEntity, string language, bool isAdmin) => new()
    {
        Id = scenarioEntity.Id,
        Slug = scenarioEntity.Slug,
        Name = AppLanguage.Pick(language, scenarioEntity.NameRo, scenarioEntity.NameEn, scenarioEntity.NameRu),
        Description = AppLanguage.Pick(language, scenarioEntity.DescriptionRo, scenarioEntity.DescriptionEn, scenarioEntity.DescriptionRu),
        NameRo = scenarioEntity.NameRo,
        NameEn = scenarioEntity.NameEn,
        NameRu = scenarioEntity.NameRu,
        DescriptionRo = scenarioEntity.DescriptionRo,
        DescriptionEn = scenarioEntity.DescriptionEn,
        DescriptionRu = scenarioEntity.DescriptionRu,
        Difficulty = scenarioEntity.Difficulty,
        InitialBalance = scenarioEntity.InitialBalance,
        RequiresAccount = scenarioEntity.RequiresAccount,
        InitialCreditScore = scenarioEntity.InitialCreditScore,
        InitialStress = scenarioEntity.InitialStress,
        StepsJson = AppLanguage.LocalizeJson(scenarioEntity.StepsJson, language),
        StepsJsonRaw = isAdmin ? scenarioEntity.StepsJson : null,
        IsDeleted = scenarioEntity.IsDeleted
    };
}
