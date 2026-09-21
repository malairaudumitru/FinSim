using FinSim.BusinessLayer.Interfaces;
using FinSim.BusinessLayer.Structure;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.Scenarios;

namespace FinSim.BusinessLayer.Core;

public class ScenarioLogic : ScenarioAction, IScenarioLogic
{
    public ScenarioLogic(AppDbContext context) : base(context) { }

    public async Task<ActionResponse> CreateScenarioAsync(ScenarioCreateDto data)
    {
        var result = await CreateScenarioActionAsync(data);
        if (result == false)
            return ActionResponse.BadRequest("Error creating scenario");
        return ActionResponse.Ok("Scenario created successfully");
    }

    public async Task<ActionResponse> GetScenarioBySlugAsync(string slug, string language, bool isAdmin)
    {
        var result = await GetScenarioBySlugActionAsync(slug, language, isAdmin);
        if (result == null)
            return ActionResponse.NotFound("Scenario not found");
        return ActionResponse.Ok(data: result);
    }

    public async Task<ActionResponse> GetScenarioListAsync(string language, bool isAdmin)
    {
        var result = await GetScenarioListActionAsync(language, isAdmin);
        return ActionResponse.Ok(data: result);
    }

    public async Task<ActionResponse> UpdateScenarioAsync(int id, ScenarioCreateDto data)
    {
        var result = await UpdateScenarioActionAsync(id, data);
        if (result == false)
            return ActionResponse.BadRequest("Error updating scenario");
        return ActionResponse.Ok("Scenario updated successfully");
    }

    public async Task<ActionResponse> DeleteScenarioAsync(int id)
    {
        var result = await DeleteScenarioActionAsync(id);
        if (result == false)
            return ActionResponse.NotFound("Scenario not found");
        return ActionResponse.Ok("Scenario deleted successfully");
    }
}
