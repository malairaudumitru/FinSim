using FinSim.BusinessLayer;
using FinSim.BusinessLayer.Interfaces;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Models.Scenarios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinSim.Api.Controllers;

[ApiController]
[Route("api/scenarios")]
public class ScenarioController : ControllerBase
{
    private readonly IScenarioLogic _scenarioLogic;

    public ScenarioController(AppDbContext context)
    {
        var bl = new BusinessLogic();
        _scenarioLogic = bl.GetScenarioLogic(context);
    }

    [HttpPost("create")]
    [Authorize(Roles = "Admin")]
    public IActionResult CreateScenario([FromBody] ScenarioCreateDto scenarioInfo)
    {
        var result = _scenarioLogic.CreateScenario(scenarioInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpGet("list")]
    public IActionResult GetScenarioList()
    {
        var result = _scenarioLogic.GetScenarioList();
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpGet("{slug}")]
    public IActionResult GetScenarioBySlug([FromRoute] string slug)
    {
        var result = _scenarioLogic.GetScenarioBySlug(slug);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPut("update/{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult UpdateScenario([FromRoute] int id, [FromBody] ScenarioCreateDto scenarioInfo)
    {
        var result = _scenarioLogic.UpdateScenario(id, scenarioInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteScenario([FromRoute] int id)
    {
        var result = _scenarioLogic.DeleteScenario(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
