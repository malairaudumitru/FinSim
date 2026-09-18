using FinSim.BusinessLayer.Interfaces;
using FinSim.BusinessLayer.Structure;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.User;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.User;

namespace FinSim.BusinessLayer.Core;

public class UserLogic : UserAction, IUserLogic
{
    public UserLogic(AppDbContext context) : base(context) { }

    public async Task<ActionResponse> CreateUserAsync(UserCreateDto data)
    {
        var result = await CreateUserActionAsync(data);
        if (result == false)
            return ActionResponse.BadRequest("Error creating user");
        return ActionResponse.Ok("User created successfully");
    }

    public async Task<ActionResponse> GetUserByIdAsync(int id)
    {
        var result = await GetUserByIdActionAsync(id);
        if (result == null)
            return ActionResponse.NotFound("User not found");
        return ActionResponse.Ok(data: result);
    }

    public async Task<ActionResponse> GetUserListAsync()
    {
        var result = await GetUserListActionAsync();
        return ActionResponse.Ok(data: result);
    }

    public async Task<ActionResponse> UpdateUserAsync(int id, UserUpdateDto data)
    {
        var result = await UpdateUserActionAsync(id, data);
        if (result == false)
            return ActionResponse.BadRequest("Error updating user");
        return ActionResponse.Ok("User updated successfully");
    }

    public async Task<ActionResponse> UpdateSelfAsync(int userId, UserSelfUpdateDto data)
    {
        var result = await UpdateSelfActionAsync(userId, data);
        if (result == false)
            return ActionResponse.BadRequest("Error updating profile");
        return ActionResponse.Ok("Profile updated successfully");
    }

    public async Task<ActionResponse> DeleteUserAsync(int id)
    {
        var result = await DeleteUserActionAsync(id);
        if (result == false)
            return ActionResponse.NotFound("User not found");
        return ActionResponse.Ok("User deleted successfully");
    }

    public async Task<ActionResponse> UpdateUserStatusAsync(int id, UserStatus status)
    {
        var result = await UpdateUserStatusActionAsync(id, status);
        if (result == false)
            return ActionResponse.BadRequest("Error updating user status");
        return ActionResponse.Ok("User status updated successfully");
    }
}
