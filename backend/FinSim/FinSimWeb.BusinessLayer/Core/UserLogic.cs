using FinSim.BusinessLayer.Interfaces;
using FinSim.BusinessLayer.Structure;
using FinSim.Domain.Entities.User;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.User;

namespace FinSim.BusinessLayer.Core;

public class UserLogic : UserAction, IUserLogic
{
    public ActionResponse CreateUser(UserCreateDto data)
    {
        var result = CreateUserAction(data);
        if (result == false)
            return ActionResponse.BadRequest("Error creating user");
        return ActionResponse.Ok("User created successfully");
    }

    public ActionResponse GetUserById(int id)
    {
        var result = GetUserByIdAction(id);
        if (result == null)
            return ActionResponse.NotFound("User not found");
        return ActionResponse.Ok(data: result);
    }

    public ActionResponse GetUserList()
    {
        var result = GetUserListAction();
        return ActionResponse.Ok(data: result);
    }

    public ActionResponse UpdateUser(int id, UserCreateDto data)
    {
        var result = UpdateUserAction(id, data);
        if (result == false)
            return ActionResponse.BadRequest("Error updating user");
        return ActionResponse.Ok("User updated successfully");
    }

    public ActionResponse DeleteUser(int id)
    {
        var result = DeleteUserAction(id);
        if (result == false)
            return ActionResponse.NotFound("User not found");
        return ActionResponse.Ok("User deleted successfully");
    }

    public ActionResponse UpdateUserStatus(int id, UserStatus status)
    {
        var result = UpdateUserStatusAction(id, status);
        if (result == false)
            return ActionResponse.BadRequest("Error updating user status");
        return ActionResponse.Ok("User status updated successfully");
    }
}
