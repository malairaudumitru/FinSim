using FinSim.Domain.Models.Auth;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.User;

namespace FinSim.BusinessLayer.Interfaces;

public interface IAuthLogic
{
    ActionResponse Register(UserRegisterDto data);
    ActionResponse Login(UserLoginDto data);
    ActionResponse Refresh(RefreshTokenRequestDto data);
    ActionResponse Logout(RefreshTokenRequestDto data);
    ActionResponse ChangePassword(int userId, ChangePasswordDto data);
}
