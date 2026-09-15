using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Interfaces;

public interface ILeaderboardLogic
{
    Task<ActionResponse> GetLeaderboardListAsync();
    Task<ActionResponse> DeleteLeaderboardEntryAsync(int id);
}
