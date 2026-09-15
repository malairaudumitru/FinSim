using FinSim.BusinessLayer;
using FinSim.BusinessLayer.Interfaces;
using FinSim.DataAccessLayer.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinSim.Api.Controllers;

[ApiController]
[Route("api/leaderboard")]
public class LeaderboardController : ControllerBase
{
    private readonly ILeaderboardLogic _leaderboardLogic;

    public LeaderboardController(AppDbContext context)
    {
        var bl = new BusinessLogic();
        _leaderboardLogic = bl.GetLeaderboardLogic(context);
    }

    [HttpGet("list")]
    public async Task<IActionResult> GetLeaderboardList()
    {
        var result = await _leaderboardLogic.GetLeaderboardListAsync();
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteLeaderboardEntry([FromRoute] int id)
    {
        var result = await _leaderboardLogic.DeleteLeaderboardEntryAsync(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
