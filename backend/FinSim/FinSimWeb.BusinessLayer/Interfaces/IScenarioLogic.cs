using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.Scenarios;

namespace FinSim.BusinessLayer.Interfaces;

public interface IScenarioLogic
{
    ActionResponse CreateScenario(ScenarioCreateDto data);
    ActionResponse GetScenarioBySlug(string slug);
    ActionResponse GetScenarioList();
    ActionResponse UpdateScenario(int id, ScenarioCreateDto data);
    ActionResponse DeleteScenario(int id);
}
