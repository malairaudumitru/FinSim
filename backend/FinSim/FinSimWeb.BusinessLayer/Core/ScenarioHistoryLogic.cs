using FinSim.BusinessLayer.Interfaces;
using FinSim.BusinessLayer.Structure;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.ScenarioHistory;

namespace FinSim.BusinessLayer.Core;

public class ScenarioHistoryLogic : ScenarioHistoryAction, IScenarioHistoryLogic
{
    public ActionResponse CreateScenarioHistory(ScenarioHistoryCreateDto data)
    {
        var result = CreateScenarioHistoryAction(data);
        if (result == false)
            return ActionResponse.BadRequest("Error creating scenario history");
        return ActionResponse.Ok("Scenario history created successfully");
    }

    public ActionResponse GetScenarioHistoryList()
    {
        var result = GetScenarioHistoryListAction();
        return ActionResponse.Ok(data: result);
    }

    public ActionResponse GetScenarioHistoryByUserId(int userId)
    {
        var result = GetScenarioHistoryByUserIdAction(userId);
        return ActionResponse.Ok(data: result);
    }

    public ActionResponse UpdateScenarioHistory(int id, ScenarioHistoryCreateDto data)
    {
        var result = UpdateScenarioHistoryAction(id, data);
        if (result == false)
            return ActionResponse.BadRequest("Error updating scenario history");
        return ActionResponse.Ok("Scenario history updated successfully");
    }

    public ActionResponse DeleteScenarioHistory(int id)
    {
        var result = DeleteScenarioHistoryAction(id);
        if (result == false)
            return ActionResponse.NotFound("Scenario history not found");
        return ActionResponse.Ok("Scenario history deleted successfully");
    }
}
