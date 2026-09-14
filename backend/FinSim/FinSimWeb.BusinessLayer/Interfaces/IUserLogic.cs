using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.User;

namespace FinSim.BusinessLayer.Interfaces;

public interface IUserLogic
{
    ActionResponse CreateUser(UserCreateDto data);
    ActionResponse GetUserById(int id);
    ActionResponse GetUserList();
    ActionResponse UpdateUser(int id, UserCreateDto data);
    ActionResponse DeleteUser(int id);
    ActionResponse UpdateUserStatus(int id, string status);
}
