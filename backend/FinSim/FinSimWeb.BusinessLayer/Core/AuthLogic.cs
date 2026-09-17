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

    public async Task<ActionResponse> StartRegisterAsync(UserRegisterDto data)
    {
        var result = await StartRegisterActionAsync(data);
        if (result == false)
            return ActionResponse.BadRequest("Email already in use");
        return ActionResponse.Ok("Cod de confirmare trimis pe email");
    }

    public async Task<ActionResponse> ConfirmRegisterAsync(RegisterConfirmDto data)
    {
        var result = await ConfirmRegisterActionAsync(data);
        if (result == false)
            return ActionResponse.BadRequest("Cod invalid sau expirat");
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

    public async Task<ActionResponse> StartChangePasswordAsync(int userId, ChangePasswordDto data)
    {
        var result = await StartChangePasswordActionAsync(userId, data);
        if (result == false)
            return ActionResponse.BadRequest("Current password is incorrect");
        return ActionResponse.Ok("Cod de confirmare trimis pe email");
    }

    public async Task<ActionResponse> ConfirmChangePasswordAsync(int userId, ConfirmCodeDto data)
    {
        var result = await ConfirmChangePasswordActionAsync(userId, data);
        if (result == false)
            return ActionResponse.BadRequest("Cod invalid sau expirat");
        return ActionResponse.Ok("Password changed successfully");
    }

    public async Task<ActionResponse> ForgotPasswordAsync(ForgotPasswordDto data)
    {
        await ForgotPasswordActionAsync(data.Email);
        return ActionResponse.Ok("Daca adresa exista in sistem, vei primi un cod pe email");
    }

    public async Task<ActionResponse> VerifyResetCodeAsync(VerifyResetCodeDto data)
    {
        var result = await VerifyResetCodeActionAsync(data);
        if (result == false)
            return ActionResponse.BadRequest("Cod invalid sau expirat");
        return ActionResponse.Ok("Cod valid");
    }

    public async Task<ActionResponse> ResetPasswordAsync(ResetPasswordDto data)
    {
        var result = await ResetPasswordActionAsync(data);
        if (result == false)
            return ActionResponse.BadRequest("Cod invalid sau expirat");
        return ActionResponse.Ok("Parola a fost resetata cu succes");
    }
}
