using FinSim.BusinessLayer.Interfaces;
using FinSim.BusinessLayer.Structure;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Core;

public class LeaderboardLogic : LeaderboardAction, ILeaderboardLogic
{
    public LeaderboardLogic(AppDbContext context) : base(context) { }

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
