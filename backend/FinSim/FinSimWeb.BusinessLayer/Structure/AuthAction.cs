using FinSim.BusinessLayer.Core;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Auth;
using FinSim.Domain.Entities.User;
using FinSim.Domain.Models.Auth;
using FinSim.Domain.Models.User;

namespace FinSim.BusinessLayer.Structure;

public class AuthAction
{
    private readonly TokenService _tokenService = new();

    protected bool RegisterAction(UserRegisterDto data)
    {
        using var userContext = new UserDbContext();

        var duplicate = userContext.Users.Any(u => u.Email == data.Email && u.IsDeleted == false);
        if (duplicate)
            return false;

        var userEntity = new UserEntity
        {
            Nume = data.Nume,
            Prenume = data.Prenume,
            Email = data.Email,
            Password = PasswordHasher.Hash(data.Password),
            Rol = UserRole.User,
            Status = UserStatus.Activ,
            DataNasterii = data.DataNasterii
        };

        try
        {
            userContext.Add(userEntity);
            userContext.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected AuthResponseDto? LoginAction(UserLoginDto data)
    {
        using var userContext = new UserDbContext();
        var user = userContext.Users.FirstOrDefault(u => u.Email == data.Email && u.IsDeleted == false);

        if (user == null || user.Status == UserStatus.Blocat)
            return null;

        if (!PasswordHasher.Verify(data.Password, user.Password))
            return null;

        return GenerateAuthResponse(user);
    }

    protected AuthResponseDto? RefreshAction(string refreshToken)
    {
        using var refreshContext = new RefreshTokenDbContext();
        var storedToken = refreshContext.RefreshTokens.FirstOrDefault(t => t.Token == refreshToken);

        if (storedToken == null || storedToken.RevokedAt != null || storedToken.ExpiresAt < DateTime.UtcNow)
            return null;

        using var userContext = new UserDbContext();
        var user = userContext.Users.FirstOrDefault(u => u.Id == storedToken.UserId && u.IsDeleted == false);
        if (user == null || user.Status == UserStatus.Blocat)
            return null;

        storedToken.RevokedAt = DateTime.UtcNow;
        refreshContext.RefreshTokens.Update(storedToken);
        refreshContext.SaveChanges();

        return GenerateAuthResponse(user);
    }

    protected bool LogoutAction(string refreshToken)
    {
        using var refreshContext = new RefreshTokenDbContext();
        var storedToken = refreshContext.RefreshTokens.FirstOrDefault(t => t.Token == refreshToken);
        if (storedToken == null || storedToken.RevokedAt != null)
            return false;

        storedToken.RevokedAt = DateTime.UtcNow;
        refreshContext.RefreshTokens.Update(storedToken);
        refreshContext.SaveChanges();
        return true;
    }

    private AuthResponseDto GenerateAuthResponse(UserEntity user)
    {
        var accessToken = _tokenService.GenerateAccessToken(user.Id, user.Nume, user.Prenume, user.Rol.ToString());
        var refreshTokenValue = _tokenService.GenerateRefreshToken();

        using var refreshContext = new RefreshTokenDbContext();
        refreshContext.Add(new RefreshTokenEntity
        {
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpiresAt = DateTime.UtcNow.AddDays(JwtSettings.RefreshTokenExpireDays)
        });
        refreshContext.SaveChanges();

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue
        };
    }
}
