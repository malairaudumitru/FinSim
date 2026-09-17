using System.Security.Claims;
using FinSim.BusinessLayer.Interfaces;
using FinSim.Domain.Models.Auth;
using FinSim.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace FinSim.Api.Controllers;

[ApiController]
[Route("api/session")]
public class SessionController : ControllerBase
{
    private readonly IAuthLogic _authLogic;
    private readonly IUserLogic _userLogic;

    public SessionController(IAuthLogic authLogic, IUserLogic userLogic)
    {
        _authLogic = authLogic;
        _userLogic = userLogic;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto loginInfo)
    {
        var result = await _authLogic.LoginAsync(loginInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequestDto refreshInfo)
    {
        var result = await _authLogic.RefreshAsync(refreshInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPost("logout")]
    [AllowAnonymous]
    public async Task<IActionResult> Logout([FromBody] RefreshTokenRequestDto refreshInfo)
    {
        var result = await _authLogic.LogoutAsync(refreshInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await _userLogic.GetUserByIdAsync(userId);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPost("change-password/start")]
    [Authorize]
    public async Task<IActionResult> StartChangePassword([FromBody] ChangePasswordDto passwordInfo)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await _authLogic.StartChangePasswordAsync(userId, passwordInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpPost("change-password/confirm")]
    [Authorize]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> ConfirmChangePassword([FromBody] ConfirmCodeDto confirmInfo)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await _authLogic.ConfirmChangePasswordAsync(userId, confirmInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotInfo)
    {
        var result = await _authLogic.ForgotPasswordAsync(forgotInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpPost("verify-reset-code")]
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> VerifyResetCode([FromBody] VerifyResetCodeDto verifyInfo)
    {
        var result = await _authLogic.VerifyResetCodeAsync(verifyInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetInfo)
    {
        var result = await _authLogic.ResetPasswordAsync(resetInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
