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

    public RegisterController(IAuthLogic authLogic)
    {
        _authLogic = authLogic;
    }

    [HttpPost("start")]
    public async Task<IActionResult> Start([FromBody] UserRegisterDto registerInfo)
    {
        var result = await _authLogic.StartRegisterAsync(registerInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpPost("confirm")]
    public async Task<IActionResult> Confirm([FromBody] RegisterConfirmDto confirmInfo)
    {
        var result = await _authLogic.ConfirmRegisterAsync(confirmInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
