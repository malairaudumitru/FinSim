using FinSim.BusinessLayer;
using FinSim.BusinessLayer.Interfaces;
using FinSim.Domain.Models.ScenarioHistory;
using Microsoft.AspNetCore.Mvc;

namespace FinSim.Api.Controllers;

[ApiController]
[Route("api/scenario-history")]
public class ScenarioHistoryController : ControllerBase
{
    private readonly IScenarioHistoryLogic _scenarioHistoryLogic;

    public ScenarioHistoryController()
    {
        var bl = new BusinessLogic();
        _scenarioHistoryLogic = bl.GetScenarioHistoryLogic();
    }

    [HttpPost("create")]
    public IActionResult CreateScenarioHistory([FromBody] ScenarioHistoryCreateDto scenarioHistoryInfo)
    {
        var result = _scenarioHistoryLogic.CreateScenarioHistory(scenarioHistoryInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpGet("list")]
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
        var result = _scenarioHistoryLogic.GetScenarioHistoryByUserId(userId);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPut("update/{id}")]
    public IActionResult UpdateScenarioHistory([FromRoute] int id, [FromBody] ScenarioHistoryCreateDto scenarioHistoryInfo)
    {
        var result = _scenarioHistoryLogic.UpdateScenarioHistory(id, scenarioHistoryInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteScenarioHistory([FromRoute] int id)
    {
        var result = _scenarioHistoryLogic.DeleteScenarioHistory(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
