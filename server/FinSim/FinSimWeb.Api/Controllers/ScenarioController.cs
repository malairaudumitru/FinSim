using FinSim.BusinessLayer.Interfaces;
using FinSim.Domain.Models.Scenarios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinSim.Api.Controllers;

[ApiController]
[Route("api/scenarios")]
public class ScenarioController : ControllerBase
{
    private readonly IScenarioLogic _scenarioLogic;

    public ScenarioController(IScenarioLogic scenarioLogic)
    {
        _scenarioLogic = scenarioLogic;
    }

    [HttpPost("create")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateScenario([FromBody] ScenarioCreateDto scenarioInfo)
    {
        var result = await _scenarioLogic.CreateScenarioAsync(scenarioInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpGet("list")]
    public async Task<IActionResult> GetScenarioList()
    {
        var result = await _scenarioLogic.GetScenarioListAsync();
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetScenarioBySlug([FromRoute] string slug)
    {
        var result = await _scenarioLogic.GetScenarioBySlugAsync(slug);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPut("update/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateScenario([FromRoute] int id, [FromBody] ScenarioCreateDto scenarioInfo)
    {
        var result = await _scenarioLogic.UpdateScenarioAsync(id, scenarioInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteScenario([FromRoute] int id)
    {
        var result = await _scenarioLogic.DeleteScenarioAsync(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
