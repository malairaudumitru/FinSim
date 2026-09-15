using FinSim.BusinessLayer.Interfaces;
using FinSim.BusinessLayer.Structure;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.Scenarios;

namespace FinSim.BusinessLayer.Core;

public class ScenarioLogic : ScenarioAction, IScenarioLogic
{
    public ScenarioLogic(AppDbContext context) : base(context) { }

    public ActionResponse CreateScenario(ScenarioCreateDto data)
    {
        var result = CreateScenarioAction(data);
        if (result == false)
            return ActionResponse.BadRequest("Error creating scenario");
        return ActionResponse.Ok("Scenario created successfully");
    }

    public ActionResponse GetScenarioBySlug(string slug)
    {
        var result = GetScenarioBySlugAction(slug);
        if (result == null)
            return ActionResponse.NotFound("Scenario not found");
        return ActionResponse.Ok(data: result);
    }

    public ActionResponse GetScenarioList()
    {
        var result = GetScenarioListAction();
        return ActionResponse.Ok(data: result);
    }

    public ActionResponse UpdateScenario(int id, ScenarioCreateDto data)
    {
        var result = UpdateScenarioAction(id, data);
        if (result == false)
            return ActionResponse.BadRequest("Error updating scenario");
        return ActionResponse.Ok("Scenario updated successfully");
    }

    public ActionResponse DeleteScenario(int id)
    {
        var result = DeleteScenarioAction(id);
        if (result == false)
            return ActionResponse.NotFound("Scenario not found");
        return ActionResponse.Ok("Scenario deleted successfully");
    }
}
