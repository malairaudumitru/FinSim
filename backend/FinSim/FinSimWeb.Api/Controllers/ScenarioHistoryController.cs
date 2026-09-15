using System.Security.Claims;
using FinSim.BusinessLayer;
using FinSim.BusinessLayer.Interfaces;
using FinSim.Domain.Models.ScenarioHistory;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinSim.Api.Controllers;

[ApiController]
[Route("api/scenario-history")]
[Authorize]
public class ScenarioHistoryController : ControllerBase
{
    private readonly IScenarioHistoryLogic _scenarioHistoryLogic;

    public ScenarioHistoryController()
    {
        var bl = new BusinessLogic();
        _scenarioHistoryLogic = bl.GetScenarioHistoryLogic();
    }

    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private bool IsAdmin => User.IsInRole("Admin");

    [HttpPost("create")]
    public IActionResult CreateScenarioHistory([FromBody] ScenarioHistoryCreateDto scenarioHistoryInfo)
    {
        var result = _scenarioHistoryLogic.CreateScenarioHistory(CurrentUserId, scenarioHistoryInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpGet("list")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetScenarioHistoryList()
    {
        var result = _scenarioHistoryLogic.GetScenarioHistoryList();
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpGet("by-user/{userId}")]
    public IActionResult GetScenarioHistoryByUserId([FromRoute] int userId)
    {
        if (!IsAdmin && userId != CurrentUserId)
            return Forbid();

        var result = _scenarioHistoryLogic.GetScenarioHistoryByUserId(userId);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPut("update/{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult UpdateScenarioHistory([FromRoute] int id, [FromBody] ScenarioHistoryUpdateDto scenarioHistoryInfo)
    {
        var result = _scenarioHistoryLogic.UpdateScenarioHistory(id, scenarioHistoryInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteScenarioHistory([FromRoute] int id)
    {
        var result = _scenarioHistoryLogic.DeleteScenarioHistory(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
