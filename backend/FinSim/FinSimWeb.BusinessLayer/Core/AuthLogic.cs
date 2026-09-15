using FinSim.BusinessLayer.Interfaces;
using FinSim.BusinessLayer.Structure;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Models.Auth;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.User;

namespace FinSim.BusinessLayer.Core;

public class AuthLogic : AuthAction, IAuthLogic
{
    public AuthLogic(AppDbContext context) : base(context) { }

    public async Task<ActionResponse> RegisterAsync(UserRegisterDto data)
    {
        var result = await RegisterActionAsync(data);
        if (result == false)
            return ActionResponse.BadRequest("Email already in use");
        return ActionResponse.Ok("Registered successfully");
    }

    public async Task<ActionResponse> LoginAsync(UserLoginDto data)
    {
        var result = await LoginActionAsync(data);
        if (result == null)
            return ActionResponse.BadRequest("Invalid email or password");
        return ActionResponse.Ok(data: result);
    }

    public async Task<ActionResponse> RefreshAsync(RefreshTokenRequestDto data)
    {
        var result = await RefreshActionAsync(data.RefreshToken);
        if (result == null)
            return ActionResponse.BadRequest("Invalid or expired refresh token");
        return ActionResponse.Ok(data: result);
    }

    public async Task<ActionResponse> LogoutAsync(RefreshTokenRequestDto data)
    {
        var result = await LogoutActionAsync(data.RefreshToken);
        if (result == false)
            return ActionResponse.BadRequest("Invalid refresh token");
        return ActionResponse.Ok("Logged out successfully");
    }

    public async Task<ActionResponse> ChangePasswordAsync(int userId, ChangePasswordDto data)
    {
        var result = await ChangePasswordActionAsync(userId, data);
        if (result == false)
            return ActionResponse.BadRequest("Current password is incorrect");
        return ActionResponse.Ok("Password changed successfully");
    }
}
