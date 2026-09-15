using FinSim.BusinessLayer.Interfaces;
using FinSim.BusinessLayer.Structure;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.ScenarioHistory;

namespace FinSim.BusinessLayer.Core;

public class ScenarioHistoryLogic : ScenarioHistoryAction, IScenarioHistoryLogic
{
    public ScenarioHistoryLogic(AppDbContext context) : base(context) { }

    public async Task<ActionResponse> CreateScenarioHistoryAsync(int userId, ScenarioHistoryCreateDto data)
    {
        var result = await CreateScenarioHistoryActionAsync(userId, data);
        if (result == false)
            return ActionResponse.BadRequest("Error creating scenario history");
        return ActionResponse.Ok("Scenario history created successfully");
    }

    public async Task<ActionResponse> GetScenarioHistoryListAsync()
    {
        var result = await GetScenarioHistoryListActionAsync();
        return ActionResponse.Ok(data: result);
    }

    public async Task<ActionResponse> GetScenarioHistoryByUserIdAsync(int userId)
    {
        var result = await GetScenarioHistoryByUserIdActionAsync(userId);
        return ActionResponse.Ok(data: result);
    }

    public async Task<ActionResponse> UpdateScenarioHistoryAsync(int id, ScenarioHistoryUpdateDto data)
    {
        var result = await UpdateScenarioHistoryActionAsync(id, data);
        if (result == false)
            return ActionResponse.BadRequest("Error updating scenario history");
        return ActionResponse.Ok("Scenario history updated successfully");
    }

    public async Task<ActionResponse> DeleteScenarioHistoryAsync(int id)
    {
        var result = await DeleteScenarioHistoryActionAsync(id);
        if (result == false)
            return ActionResponse.NotFound("Scenario history not found");
        return ActionResponse.Ok("Scenario history deleted successfully");
    }
}
