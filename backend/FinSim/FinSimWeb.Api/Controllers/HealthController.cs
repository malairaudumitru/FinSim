using Microsoft.AspNetCore.Mvc;

namespace FinSim.Api.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet("check")]
    public IActionResult Check()
    {
        return Ok("Server is running");
    }
    
}