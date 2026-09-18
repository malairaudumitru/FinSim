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

    protected async Task<bool> CreateUserActionAsync(UserCreateDto data)
    {
        var validate = await ValidateUserAsync(data.LastName, data.FirstName, data.Email);
        if (!validate.IsSuccess)
            return false;

        var userEntity = new UserEntity
        {
            LastName = data.LastName,
            FirstName = data.FirstName,
            Email = data.Email,
            Password = PasswordHasher.Hash(data.Password),
            Role = data.Role,
            Status = data.Status,
            CompletedScenarios = data.CompletedScenarios,
            TotalScore = data.TotalScore,
            BirthDate = data.BirthDate
        };

        try
        {
            _context.Add(userEntity);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private async Task<ActionResponse> ValidateUserAsync(string lastName, string firstName, string email, int? excludingId = null)
    {
        if (string.IsNullOrEmpty(lastName))
            return new ActionResponse { IsSuccess = false, Message = "LastName is empty" };
        if (string.IsNullOrEmpty(firstName))
            return new ActionResponse { IsSuccess = false, Message = "FirstName is empty" };
        if (string.IsNullOrEmpty(email))
            return new ActionResponse { IsSuccess = false, Message = "Email is empty" };

        var duplicate = await _context.Users.AnyAsync(u =>
            u.Email == email && u.IsDeleted == false && u.Id != (excludingId ?? 0));
        if (duplicate)
            return new ActionResponse { IsSuccess = false, Message = "Email already in use" };

        return new ActionResponse { IsSuccess = true };
    }

    protected async Task<UserInfoDto?> GetUserByIdActionAsync(int id)
    {
        var userEntity = await _context.Users
            .FirstOrDefaultAsync(x => x.Id == id && x.IsDeleted == false);
        if (userEntity == null)
            return null;

        return MapToInfoDto(userEntity);
    }

    protected async Task<List<UserInfoDto>> GetUserListActionAsync()
    {
        return await _context.Users
            .Where(x => x.IsDeleted == false)
            .Select(userEntity => MapToInfoDto(userEntity))
            .ToListAsync();
    }

    protected async Task<bool> UpdateUserActionAsync(int id, UserUpdateDto data)
    {
        var userEntity = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
        if (userEntity == null || userEntity.IsDeleted)
            return false;

        var validate = await ValidateUserAsync(data.LastName, data.FirstName, data.Email, excludingId: id);
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
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<bool> UpdateSelfActionAsync(int userId, UserSelfUpdateDto data)
    {
        var userEntity = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);
        if (userEntity == null || userEntity.IsDeleted)
            return false;

        var validate = await ValidateUserAsync(data.LastName, data.FirstName, data.Email, excludingId: userId);
        if (!validate.IsSuccess)
            return false;

        userEntity.LastName = data.LastName;
        userEntity.FirstName = data.FirstName;
        userEntity.Email = data.Email;
        userEntity.BirthDate = data.BirthDate;

        if (!string.IsNullOrEmpty(data.Password))
            userEntity.Password = PasswordHasher.Hash(data.Password);

        try
        {
            _context.Users.Update(userEntity);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<bool> DeleteUserActionAsync(int id)
    {
        var userEntity = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
        if (userEntity == null)
            return false;

        try
        {
            userEntity.IsDeleted = true;
            _context.Users.Update(userEntity);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<bool> UpdateUserStatusActionAsync(int id, UserStatus status)
    {
        var userEntity = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
        if (userEntity == null || userEntity.IsDeleted)
            return false;

        userEntity.Status = status;

        try
        {
            _context.Users.Update(userEntity);
            await _context.SaveChangesAsync();
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
