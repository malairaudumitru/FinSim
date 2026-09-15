using FinSim.BusinessLayer.Core;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Auth;
using FinSim.Domain.Entities.User;
using FinSim.Domain.Models.Auth;
using FinSim.Domain.Models.User;
using Microsoft.EntityFrameworkCore;

namespace FinSim.BusinessLayer.Structure;

public class AuthAction
{
    protected readonly AppDbContext _context;
    private readonly TokenService _tokenService = new();

    public AuthAction(AppDbContext context)
    {
        _context = context;
    }

    protected async Task<bool> RegisterActionAsync(UserRegisterDto data)
    {
        var duplicate = await _context.Users.AnyAsync(u => u.Email == data.Email && u.IsDeleted == false);
        if (duplicate)
            return false;

        var userEntity = new UserEntity
        {
            LastName = data.LastName,
            FirstName = data.FirstName,
            Email = data.Email,
            Password = PasswordHasher.Hash(data.Password),
            Role = UserRole.User,
            Status = UserStatus.Active,
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

    protected async Task<AuthResponseDto?> LoginActionAsync(UserLoginDto data)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == data.Email && u.IsDeleted == false);

        if (user == null || user.Status == UserStatus.Blocked)
            return null;

        if (!PasswordHasher.Verify(data.Password, user.Password))
            return null;

        return await GenerateAuthResponseAsync(user);
    }

    protected async Task<AuthResponseDto?> RefreshActionAsync(string refreshToken)
    {
        var storedToken = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == refreshToken);

        if (storedToken == null || storedToken.RevokedAt != null || storedToken.ExpiresAt < DateTime.UtcNow)
            return null;

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == storedToken.UserId && u.IsDeleted == false);
        if (user == null || user.Status == UserStatus.Blocked)
            return null;

        storedToken.RevokedAt = DateTime.UtcNow;
        _context.RefreshTokens.Update(storedToken);
        await _context.SaveChangesAsync();

        return await GenerateAuthResponseAsync(user);
    }

    protected async Task<bool> ChangePasswordActionAsync(int userId, ChangePasswordDto data)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId && u.IsDeleted == false);
        if (user == null)
            return false;

        if (!PasswordHasher.Verify(data.CurrentPassword, user.Password))
            return false;

        user.Password = PasswordHasher.Hash(data.NewPassword);

        try
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<bool> LogoutActionAsync(string refreshToken)
    {
        var storedToken = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == refreshToken);
        if (storedToken == null || storedToken.RevokedAt != null)
            return false;

        storedToken.RevokedAt = DateTime.UtcNow;
        _context.RefreshTokens.Update(storedToken);
        await _context.SaveChangesAsync();
        return true;
    }

    private async Task<AuthResponseDto> GenerateAuthResponseAsync(UserEntity user)
    {
        var accessToken = _tokenService.GenerateAccessToken(user.Id, user.LastName, user.FirstName, user.Role.ToString());
        var refreshTokenValue = _tokenService.GenerateRefreshToken();

        _context.Add(new RefreshTokenEntity
        {
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpiresAt = DateTime.UtcNow.AddDays(JwtSettings.RefreshTokenExpireDays)
        });
        await _context.SaveChangesAsync();

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue
        };
    }
}
