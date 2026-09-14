using FinSim.BusinessLayer.Interfaces;
using FinSim.BusinessLayer.Structure;
using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Core;

public class LeaderboardLogic : LeaderboardAction, ILeaderboardLogic
{
    public ActionResponse GetLeaderboardList()
    {
        var result = GetLeaderboardListAction();
        return ActionResponse.Ok(data: result);
    }

    public ActionResponse DeleteLeaderboardEntry(int id)
    {
        var result = DeleteLeaderboardEntryAction(id);
        if (result == false)
            return ActionResponse.NotFound("Leaderboard entry not found");
        return ActionResponse.Ok("Leaderboard entry deleted successfully");
    }
}
