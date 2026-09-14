using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Interfaces;

public interface ILeaderboardLogic
{
    ActionResponse GetLeaderboardList();
    ActionResponse DeleteLeaderboardEntry(int id);
}
