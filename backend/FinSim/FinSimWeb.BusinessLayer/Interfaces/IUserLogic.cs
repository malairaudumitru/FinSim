using FinSim.Domain.Entities.User;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.User;

namespace FinSim.BusinessLayer.Interfaces;

public interface IUserLogic
{
    Task<ActionResponse> CreateUserAsync(UserCreateDto data);
    Task<ActionResponse> GetUserByIdAsync(int id);
    Task<ActionResponse> GetUserListAsync();
    Task<ActionResponse> UpdateUserAsync(int id, UserCreateDto data);
    Task<ActionResponse> DeleteUserAsync(int id);
    Task<ActionResponse> UpdateUserStatusAsync(int id, UserStatus status);
}
