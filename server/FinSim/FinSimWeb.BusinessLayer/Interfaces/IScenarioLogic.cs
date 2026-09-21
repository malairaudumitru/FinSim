using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.Scenarios;

namespace FinSim.BusinessLayer.Interfaces;

public interface IScenarioLogic
{
    Task<ActionResponse> CreateScenarioAsync(ScenarioCreateDto data);
    Task<ActionResponse> GetScenarioBySlugAsync(string slug, string language, bool isAdmin);
    Task<ActionResponse> GetScenarioListAsync(string language, bool isAdmin);
    Task<ActionResponse> UpdateScenarioAsync(int id, ScenarioCreateDto data);
    Task<ActionResponse> DeleteScenarioAsync(int id);
}
