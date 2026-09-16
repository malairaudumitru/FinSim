using System.Security.Claims;
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

    public ScenarioHistoryController(IScenarioHistoryLogic scenarioHistoryLogic)
    {
        _scenarioHistoryLogic = scenarioHistoryLogic;
    }

    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private bool IsAdmin => User.IsInRole("Admin");

    [HttpPost("create")]
    public async Task<IActionResult> CreateScenarioHistory([FromBody] ScenarioHistoryCreateDto scenarioHistoryInfo)
    {
        var result = await _scenarioHistoryLogic.CreateScenarioHistoryAsync(CurrentUserId, scenarioHistoryInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpGet("list")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetScenarioHistoryList()
    {
        var result = await _scenarioHistoryLogic.GetScenarioHistoryListAsync();
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpGet("by-user/{userId}")]
    public async Task<IActionResult> GetScenarioHistoryByUserId([FromRoute] int userId)
    {
        if (!IsAdmin && userId != CurrentUserId)
            return Forbid();

        var result = await _scenarioHistoryLogic.GetScenarioHistoryByUserIdAsync(userId);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPut("update/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateScenarioHistory([FromRoute] int id, [FromBody] ScenarioHistoryUpdateDto scenarioHistoryInfo)
    {
        var result = await _scenarioHistoryLogic.UpdateScenarioHistoryAsync(id, scenarioHistoryInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteScenarioHistory([FromRoute] int id)
    {
        var result = await _scenarioHistoryLogic.DeleteScenarioHistoryAsync(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
