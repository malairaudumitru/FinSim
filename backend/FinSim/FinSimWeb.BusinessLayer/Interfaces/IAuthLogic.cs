using FinSim.Domain.Models.Auth;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.User;

namespace FinSim.BusinessLayer.Interfaces;

public interface IAuthLogic
{
    Task<ActionResponse> RegisterAsync(UserRegisterDto data);
    Task<ActionResponse> LoginAsync(UserLoginDto data);
    Task<ActionResponse> RefreshAsync(RefreshTokenRequestDto data);
    Task<ActionResponse> LogoutAsync(RefreshTokenRequestDto data);
    Task<ActionResponse> ChangePasswordAsync(int userId, ChangePasswordDto data);
}
