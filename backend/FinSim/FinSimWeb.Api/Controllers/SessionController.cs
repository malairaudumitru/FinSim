using System.Security.Claims;
using FinSim.BusinessLayer;
using FinSim.BusinessLayer.Interfaces;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Models.Auth;
using FinSim.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinSim.Api.Controllers;

[ApiController]
[Route("api/session")]
public class SessionController : ControllerBase
{
    private readonly IAuthLogic _authLogic;
    private readonly IUserLogic _userLogic;

    public SessionController(AppDbContext context)
    {
        var bl = new BusinessLogic();
        _authLogic = bl.GetAuthLogic(context);
        _userLogic = bl.GetUserLogic(context);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public IActionResult Login([FromBody] UserLoginDto loginInfo)
    {
        var result = _authLogic.Login(loginInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    public IActionResult Refresh([FromBody] RefreshTokenRequestDto refreshInfo)
    {
        var result = _authLogic.Refresh(refreshInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPost("logout")]
    [AllowAnonymous]
    public IActionResult Logout([FromBody] RefreshTokenRequestDto refreshInfo)
    {
        var result = _authLogic.Logout(refreshInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = _userLogic.GetUserById(userId);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPut("change-password")]
    [Authorize]
    public IActionResult ChangePassword([FromBody] ChangePasswordDto passwordInfo)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = _authLogic.ChangePassword(userId, passwordInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
