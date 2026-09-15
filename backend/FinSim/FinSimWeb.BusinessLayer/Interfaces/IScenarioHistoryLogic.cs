using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.ScenarioHistory;

namespace FinSim.BusinessLayer.Interfaces;

public interface IScenarioHistoryLogic
{
    ActionResponse CreateScenarioHistory(int userId, ScenarioHistoryCreateDto data);
    ActionResponse GetScenarioHistoryList();
    ActionResponse GetScenarioHistoryByUserId(int userId);
    ActionResponse UpdateScenarioHistory(int id, ScenarioHistoryUpdateDto data);
    ActionResponse DeleteScenarioHistory(int id);
}
