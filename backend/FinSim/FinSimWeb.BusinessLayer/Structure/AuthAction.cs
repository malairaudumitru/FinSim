using FinSim.BusinessLayer.Core;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Auth;
using FinSim.Domain.Entities.User;
using FinSim.Domain.Models.Auth;
using FinSim.Domain.Models.User;

namespace FinSim.BusinessLayer.Structure;

public class AuthAction
{
    protected readonly AppDbContext _context;
    private readonly TokenService _tokenService = new();

    public AuthAction(AppDbContext context)
    {
        _context = context;
    }

    protected bool RegisterAction(UserRegisterDto data)
    {
        var duplicate = _context.Users.Any(u => u.Email == data.Email && u.IsDeleted == false);
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
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected AuthResponseDto? LoginAction(UserLoginDto data)
    {
        var user = _context.Users.FirstOrDefault(u => u.Email == data.Email && u.IsDeleted == false);

        if (user == null || user.Status == UserStatus.Blocked)
            return null;

        if (!PasswordHasher.Verify(data.Password, user.Password))
            return null;

        return GenerateAuthResponse(user);
    }

    protected AuthResponseDto? RefreshAction(string refreshToken)
    {
        var storedToken = _context.RefreshTokens.FirstOrDefault(t => t.Token == refreshToken);

        if (storedToken == null || storedToken.RevokedAt != null || storedToken.ExpiresAt < DateTime.UtcNow)
            return null;

        var user = _context.Users.FirstOrDefault(u => u.Id == storedToken.UserId && u.IsDeleted == false);
        if (user == null || user.Status == UserStatus.Blocked)
            return null;

        storedToken.RevokedAt = DateTime.UtcNow;
        _context.RefreshTokens.Update(storedToken);
        _context.SaveChanges();

        return GenerateAuthResponse(user);
    }

    protected bool ChangePasswordAction(int userId, ChangePasswordDto data)
    {
        var user = _context.Users.FirstOrDefault(u => u.Id == userId && u.IsDeleted == false);
        if (user == null)
            return false;

        if (!PasswordHasher.Verify(data.CurrentPassword, user.Password))
            return false;

        user.Password = PasswordHasher.Hash(data.NewPassword);

        try
        {
            _context.Users.Update(user);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected bool LogoutAction(string refreshToken)
    {
        var storedToken = _context.RefreshTokens.FirstOrDefault(t => t.Token == refreshToken);
        if (storedToken == null || storedToken.RevokedAt != null)
            return false;

        storedToken.RevokedAt = DateTime.UtcNow;
        _context.RefreshTokens.Update(storedToken);
        _context.SaveChanges();
        return true;
    }

    private AuthResponseDto GenerateAuthResponse(UserEntity user)
    {
        var accessToken = _tokenService.GenerateAccessToken(user.Id, user.LastName, user.FirstName, user.Role.ToString());
        var refreshTokenValue = _tokenService.GenerateRefreshToken();

        _context.Add(new RefreshTokenEntity
        {
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpiresAt = DateTime.UtcNow.AddDays(JwtSettings.RefreshTokenExpireDays)
        });
        _context.SaveChanges();

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue
        };
    }
}
