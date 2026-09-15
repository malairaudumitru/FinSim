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
    public IActionResult GetLeaderboardList()
    {
        var result = _leaderboardLogic.GetLeaderboardList();
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteLeaderboardEntry([FromRoute] int id)
    {
        var result = _leaderboardLogic.DeleteLeaderboardEntry(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
