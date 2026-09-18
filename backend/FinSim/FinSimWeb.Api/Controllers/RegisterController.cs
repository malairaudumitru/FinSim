using FinSim.Api.Middleware;
using FinSim.BusinessLayer.Interfaces;
using FinSim.Domain.Models.Auth;
using FinSim.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace FinSim.Api.Controllers;

[ApiController]
[Route("api/register")]
[AllowAnonymous]
[EnableRateLimiting("auth")]
public class RegisterController : ControllerBase
{
    private readonly IAuthLogic _authLogic;
    private readonly ILogger<RegisterController> _logger;

    public RegisterController(IAuthLogic authLogic, ILogger<RegisterController> logger)
    {
        _authLogic = authLogic;
        _logger = logger;
    }

    [HttpPost("start")]
    public async Task<IActionResult> Start([FromBody] UserRegisterDto registerInfo)
    {
        var ip = RequestContextHelpers.GetIp(HttpContext);
        var result = await _authLogic.StartRegisterAsync(registerInfo);

        if (result.IsSuccess == false)
        {
            _logger.LogWarning("Failed register attempt for {Email} from {Ip}", registerInfo.Email, ip);
            return StatusCode((int)result.StatusCode, result.Message);
        }

        _logger.LogInformation("Register started for {Email} from {Ip}", registerInfo.Email, ip);
        return Ok(result.Message);
    }

    [HttpPost("confirm")]
    public async Task<IActionResult> Confirm([FromBody] RegisterConfirmDto confirmInfo)
    {
        var ip = RequestContextHelpers.GetIp(HttpContext);
        var result = await _authLogic.ConfirmRegisterAsync(confirmInfo);

        if (result.IsSuccess == false)
        {
            _logger.LogWarning("Invalid or expired register code for {Email} from {Ip}", confirmInfo.Email, ip);
            return StatusCode((int)result.StatusCode, result.Message);
        }

        _logger.LogInformation("Account registered for {Email} from {Ip}", confirmInfo.Email, ip);
        return Ok(result.Message);
    }
}
