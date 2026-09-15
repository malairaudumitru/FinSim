using FinSim.BusinessLayer.Core;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.User;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.User;
using Microsoft.EntityFrameworkCore;

namespace FinSim.BusinessLayer.Structure;

public class UserAction
{
    protected readonly AppDbContext _context;

    public UserAction(AppDbContext context)
    {
        _context = context;
    }

    protected bool CreateUserAction(UserCreateDto data)
    {
        var validate = ValidateUser(data);
        if (!validate.IsSuccess)
            return false;

        var userEntity = new UserEntity
        {
            LastName = data.LastName,
            FirstName = data.FirstName,
            Email = data.Email,
            Password = string.IsNullOrEmpty(data.Password) ? string.Empty : PasswordHasher.Hash(data.Password),
            Role = data.Role,
            Status = data.Status,
            CompletedScenarios = data.CompletedScenarios,
            TotalScore = data.TotalScore,
            BirthDate = data.BirthDate
        };

        try
        {
            _context.Add(userEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private ActionResponse ValidateUser(UserCreateDto data, int? excludingId = null)
    {
        if (string.IsNullOrEmpty(data.LastName))
            return new ActionResponse { IsSuccess = false, Message = "LastName is empty" };
        if (string.IsNullOrEmpty(data.FirstName))
            return new ActionResponse { IsSuccess = false, Message = "FirstName is empty" };
        if (string.IsNullOrEmpty(data.Email))
            return new ActionResponse { IsSuccess = false, Message = "Email is empty" };

        var duplicate = _context.Users.Any(u =>
            u.Email == data.Email && u.IsDeleted == false && u.Id != (excludingId ?? 0));
        if (duplicate)
            return new ActionResponse { IsSuccess = false, Message = "Email already in use" };

        return new ActionResponse { IsSuccess = true };
    }

    protected UserInfoDto? GetUserByIdAction(int id)
    {
        var userEntity = _context.Users
            .FirstOrDefault(x => x.Id == id && x.IsDeleted == false);
        if (userEntity == null)
            return null;

        return MapToInfoDto(userEntity);
    }

    protected List<UserInfoDto> GetUserListAction()
    {
        return _context.Users
            .Where(x => x.IsDeleted == false)
            .Select(userEntity => MapToInfoDto(userEntity))
            .ToList();
    }

    protected bool UpdateUserAction(int id, UserCreateDto data)
    {
        var userEntity = _context.Users.Find(id); // in loc de find firstordefault
        if (userEntity == null || userEntity.IsDeleted)
            return false;

        var validate = ValidateUser(data, excludingId: id);
        if (!validate.IsSuccess)
            return false;

        userEntity.LastName = data.LastName;
        userEntity.FirstName = data.FirstName;
        userEntity.Email = data.Email;
        userEntity.Role = data.Role;
        userEntity.Status = data.Status;
        userEntity.CompletedScenarios = data.CompletedScenarios;
        userEntity.TotalScore = data.TotalScore;
        userEntity.BirthDate = data.BirthDate;

        if (!string.IsNullOrEmpty(data.Password))
            userEntity.Password = PasswordHasher.Hash(data.Password);

        try
        {
            _context.Users.Update(userEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected bool DeleteUserAction(int id)
    {
        var userEntity = _context.Users.Find(id);
        if (userEntity == null)
            return false;

        try
        {
            userEntity.IsDeleted = true;
            _context.Users.Update(userEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected bool UpdateUserStatusAction(int id, UserStatus status)
    {
        var userEntity = _context.Users.Find(id);
        if (userEntity == null || userEntity.IsDeleted)
            return false;

        userEntity.Status = status;

        try
        {
            _context.Users.Update(userEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private static UserInfoDto MapToInfoDto(UserEntity userEntity) => new()
    {
        Id = userEntity.Id,
        LastName = userEntity.LastName,
        FirstName = userEntity.FirstName,
        Email = userEntity.Email,
        Role = userEntity.Role,
        Status = userEntity.Status,
        RegisteredAt = userEntity.RegisteredAt,
        CompletedScenarios = userEntity.CompletedScenarios,
        TotalScore = userEntity.TotalScore,
        BirthDate = userEntity.BirthDate,
        IsDeleted = userEntity.IsDeleted
    };
}
