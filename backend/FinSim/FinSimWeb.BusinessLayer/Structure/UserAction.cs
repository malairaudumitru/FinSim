using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.User;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.User;
using Microsoft.EntityFrameworkCore;

namespace FinSim.BusinessLayer.Structure;

public class UserAction
{
    private readonly UserDbContext _context = new();

    protected bool CreateUserAction(UserCreateDto data)
    {
        var validate = ValidateUser(data);
        if (!validate.IsSuccess)
            return false;

        var userEntity = new UserEntity
        {
            Nume = data.Nume,
            Prenume = data.Prenume,
            Email = data.Email,
            Password = data.Password ?? string.Empty,
            Rol = data.Rol,
            Status = data.Status,
            ScenariiFinalizate = data.ScenariiFinalizate,
            ScorTotal = data.ScorTotal,
            DataNasterii = data.DataNasterii
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
        if (string.IsNullOrEmpty(data.Nume))
            return new ActionResponse { IsSuccess = false, Message = "Nume is empty" };
        if (string.IsNullOrEmpty(data.Prenume))
            return new ActionResponse { IsSuccess = false, Message = "Prenume is empty" };
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
        var userEntity = _context.Users.Find(id);
        if (userEntity == null || userEntity.IsDeleted)
            return false;

        var validate = ValidateUser(data, excludingId: id);
        if (!validate.IsSuccess)
            return false;

        userEntity.Nume = data.Nume;
        userEntity.Prenume = data.Prenume;
        userEntity.Email = data.Email;
        userEntity.Rol = data.Rol;
        userEntity.Status = data.Status;
        userEntity.ScenariiFinalizate = data.ScenariiFinalizate;
        userEntity.ScorTotal = data.ScorTotal;
        userEntity.DataNasterii = data.DataNasterii;

        if (!string.IsNullOrEmpty(data.Password))
            userEntity.Password = data.Password;

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
        Nume = userEntity.Nume,
        Prenume = userEntity.Prenume,
        Email = userEntity.Email,
        Rol = userEntity.Rol,
        Status = userEntity.Status,
        DataInregistrare = userEntity.DataInregistrare,
        ScenariiFinalizate = userEntity.ScenariiFinalizate,
        ScorTotal = userEntity.ScorTotal,
        DataNasterii = userEntity.DataNasterii,
        IsDeleted = userEntity.IsDeleted
    };
}
