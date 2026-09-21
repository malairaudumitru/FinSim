using System.Security.Claims;
using FinSim.Api.Middleware;
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
    private readonly ILogger<SessionController> _logger;

    public SessionController(IAuthLogic authLogic, IUserLogic userLogic, ILogger<SessionController> logger)
    {
        _authLogic = authLogic;
        _userLogic = userLogic;
        _logger = logger;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> Login([FromBody] UserLoginDto loginInfo)
    {
        var ip = RequestContextHelpers.GetIp(HttpContext);
        var result = await _authLogic.LoginAsync(loginInfo);

        if (result.IsSuccess == false)
        {
            _logger.LogWarning("Failed login attempt for {Email} from {Ip}", loginInfo.Email, ip);
            return StatusCode((int)result.StatusCode, result.Message);
        }

        _logger.LogInformation("Successful login for {Email} from {Ip}", loginInfo.Email, ip);
        return Ok(result.Data);
    }

    [HttpPost("refresh")]
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequestDto refreshInfo)
    {
        var result = await _authLogic.RefreshAsync(refreshInfo);
        if (result.IsSuccess == false)
        {
            _logger.LogWarning("Invalid or expired refresh token used from {Ip}",
                RequestContextHelpers.GetIp(HttpContext));
            return StatusCode((int)result.StatusCode, result.Message);
        }

        return Ok(result.Data);
    }

    [HttpPost("logout")]
    [AllowAnonymous]
    public async Task<IActionResult> Logout([FromBody] RefreshTokenRequestDto refreshInfo)
    {
        var result = await _authLogic.LogoutAsync(refreshInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        _logger.LogInformation("Logout from {Ip}", RequestContextHelpers.GetIp(HttpContext));
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
        var ip = RequestContextHelpers.GetIp(HttpContext);

        var result = await _authLogic.StartChangePasswordAsync(userId, passwordInfo, RequestContextHelpers.GetLanguage(HttpContext));
        if (result.IsSuccess == false)
        {
            _logger.LogWarning("Failed change-password attempt (wrong current password) for user {UserId} from {Ip}", userId, ip);
            return StatusCode((int)result.StatusCode, result.Message);
        }

        _logger.LogInformation("Change-password requested by user {UserId} from {Ip}", userId, ip);
        return Ok(result.Message);
    }

    [HttpPost("change-password/confirm")]
    [Authorize]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> ConfirmChangePassword([FromBody] ConfirmCodeDto confirmInfo)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var ip = RequestContextHelpers.GetIp(HttpContext);

        var result = await _authLogic.ConfirmChangePasswordAsync(userId, confirmInfo);
        if (result.IsSuccess == false)
        {
            _logger.LogWarning("Invalid or expired change-password code for user {UserId} from {Ip}", userId, ip);
            return StatusCode((int)result.StatusCode, result.Message);
        }

        _logger.LogWarning("Password changed successfully for user {UserId} from {Ip}", userId, ip);
        return Ok(result.Message);
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotInfo)
    {
        var ip = RequestContextHelpers.GetIp(HttpContext);
        _logger.LogWarning("Password reset requested for {Email} from {Ip}", forgotInfo.Email, ip);

        var result = await _authLogic.ForgotPasswordAsync(forgotInfo, RequestContextHelpers.GetLanguage(HttpContext));
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpPost("verify-reset-code")]
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> VerifyResetCode([FromBody] VerifyResetCodeDto verifyInfo)
    {
        var ip = RequestContextHelpers.GetIp(HttpContext);
        var result = await _authLogic.VerifyResetCodeAsync(verifyInfo);

        if (result.IsSuccess == false)
        {
            _logger.LogWarning("Invalid or expired reset code entered for {Email} from {Ip}", verifyInfo.Email, ip);
            return StatusCode((int)result.StatusCode, result.Message);
        }

        return Ok(result.Message);
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetInfo)
    {
        var ip = RequestContextHelpers.GetIp(HttpContext);
        var result = await _authLogic.ResetPasswordAsync(resetInfo);

        if (result.IsSuccess == false)
        {
            _logger.LogWarning("Invalid or expired reset code used for {Email} from {Ip}", resetInfo.Email, ip);
            return StatusCode((int)result.StatusCode, result.Message);
        }

        _logger.LogWarning("Password reset completed for {Email} from {Ip}", resetInfo.Email, ip);
        return Ok(result.Message);
    }
}
