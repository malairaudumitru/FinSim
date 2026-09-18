using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.ScenarioHistory;

namespace FinSim.BusinessLayer.Interfaces;

public interface IScenarioHistoryLogic
{
    Task<ActionResponse> CreateScenarioHistoryAsync(int userId, ScenarioHistoryCreateDto data);
    Task<ActionResponse> GetScenarioHistoryListAsync();
    Task<ActionResponse> GetScenarioHistoryByUserIdAsync(int userId);
    Task<ActionResponse> UpdateScenarioHistoryAsync(int id, ScenarioHistoryUpdateDto data);
    Task<ActionResponse> DeleteScenarioHistoryAsync(int id);
}
