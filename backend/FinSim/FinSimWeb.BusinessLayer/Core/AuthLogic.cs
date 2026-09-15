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

    public ActionResponse Register(UserRegisterDto data)
    {
        var result = RegisterAction(data);
        if (result == false)
            return ActionResponse.BadRequest("Email already in use");
        return ActionResponse.Ok("Registered successfully");
    }

    public ActionResponse Login(UserLoginDto data)
    {
        var result = LoginAction(data);
        if (result == null)
            return ActionResponse.BadRequest("Invalid email or password");
        return ActionResponse.Ok(data: result);
    }

    public ActionResponse Refresh(RefreshTokenRequestDto data)
    {
        var result = RefreshAction(data.RefreshToken);
        if (result == null)
            return ActionResponse.BadRequest("Invalid or expired refresh token");
        return ActionResponse.Ok(data: result);
    }

    public ActionResponse Logout(RefreshTokenRequestDto data)
    {
        var result = LogoutAction(data.RefreshToken);
        if (result == false)
            return ActionResponse.BadRequest("Invalid refresh token");
        return ActionResponse.Ok("Logged out successfully");
    }

    public ActionResponse ChangePassword(int userId, ChangePasswordDto data)
    {
        var result = ChangePasswordAction(userId, data);
        if (result == false)
            return ActionResponse.BadRequest("Current password is incorrect");
        return ActionResponse.Ok("Password changed successfully");
    }
}
