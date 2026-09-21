using FinSim.Domain.Models.Auth;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.User;

namespace FinSim.BusinessLayer.Interfaces;

public interface IAuthLogic
{
    Task<ActionResponse> StartRegisterAsync(UserRegisterDto data, string language);
    Task<ActionResponse> ConfirmRegisterAsync(RegisterConfirmDto data);
    Task<ActionResponse> LoginAsync(UserLoginDto data);
    Task<ActionResponse> RefreshAsync(RefreshTokenRequestDto data);
    Task<ActionResponse> LogoutAsync(RefreshTokenRequestDto data);
    Task<ActionResponse> StartChangePasswordAsync(int userId, ChangePasswordDto data, string language);
    Task<ActionResponse> ConfirmChangePasswordAsync(int userId, ConfirmCodeDto data);
    Task<ActionResponse> ForgotPasswordAsync(ForgotPasswordDto data, string language);
    Task<ActionResponse> VerifyResetCodeAsync(VerifyResetCodeDto data);
    Task<ActionResponse> ResetPasswordAsync(ResetPasswordDto data);
}
