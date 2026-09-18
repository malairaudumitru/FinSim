using FinSim.BusinessLayer.Interfaces;
using FinSim.BusinessLayer.Structure;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Core;

public class LeaderboardLogic : LeaderboardAction, ILeaderboardLogic
{
    public LeaderboardLogic(AppDbContext context) : base(context) { }

    public async Task<ActionResponse> GetLeaderboardListAsync()
    {
        var result = await GetLeaderboardListActionAsync();
        return ActionResponse.Ok(data: result);
    }

    public async Task<ActionResponse> DeleteLeaderboardEntryAsync(int id)
    {
        var result = await DeleteLeaderboardEntryActionAsync(id);
        if (result == false)
            return ActionResponse.NotFound("Leaderboard entry not found");
        return ActionResponse.Ok("Leaderboard entry deleted successfully");
    }
}
