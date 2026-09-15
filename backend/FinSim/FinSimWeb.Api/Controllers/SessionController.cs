using FinSim.BusinessLayer;
using FinSim.BusinessLayer.Interfaces;
using FinSim.Domain.Models.Auth;
using FinSim.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinSim.Api.Controllers;

[ApiController]
[Route("api/session")]
[AllowAnonymous]
public class SessionController : ControllerBase
{
    private readonly IAuthLogic _authLogic;

    public SessionController()
    {
        var bl = new BusinessLogic();
        _authLogic = bl.GetAuthLogic();
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] UserLoginDto loginInfo)
    {
        var result = _authLogic.Login(loginInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPost("refresh")]
    public IActionResult Refresh([FromBody] RefreshTokenRequestDto refreshInfo)
    {
        var result = _authLogic.Refresh(refreshInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPost("logout")]
    public IActionResult Logout([FromBody] RefreshTokenRequestDto refreshInfo)
    {
        var result = _authLogic.Logout(refreshInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
