using System.Security.Cryptography;
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
    private readonly EmailSender _emailSender = new();

    private const int CodeExpiryMinutes = 5;

    public AuthAction(AppDbContext context)
    {
        _context = context;
    }

    protected async Task<bool> StartRegisterActionAsync(UserRegisterDto data)
    {
        var duplicate = await _context.Users.AnyAsync(u => u.Email == data.Email && u.IsDeleted == false);
        if (duplicate)
            return false;

        var existingPending = _context.PendingRegistrations.Where(p => p.Email == data.Email);
        _context.PendingRegistrations.RemoveRange(existingPending);

        var code = GenerateCode();

        var pending = new PendingRegistrationEntity
        {
            Email = data.Email,
            FirstName = data.FirstName,
            LastName = data.LastName,
            PasswordHash = PasswordHasher.Hash(data.Password),
            BirthDate = data.BirthDate!.Value,
            Code = code,
            ExpiresAt = DateTime.UtcNow.AddMinutes(CodeExpiryMinutes)
        };

        try
        {
            _context.Add(pending);
            await _context.SaveChangesAsync();

            await SendCodeEmailAsync(data.Email, "Confirmă înregistrarea",
                "Foloseste codul de mai jos ca sa iti finalizezi crearea contului FinSim.", code);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<bool> ConfirmRegisterActionAsync(RegisterConfirmDto data)
    {
        var pending = await _context.PendingRegistrations.FirstOrDefaultAsync(p => p.Email == data.Email);
        if (pending == null || pending.Code != data.Code || pending.ExpiresAt < DateTime.UtcNow)
            return false;

        var userEntity = new UserEntity
        {
            LastName = pending.LastName,
            FirstName = pending.FirstName,
            Email = pending.Email,
            Password = pending.PasswordHash,
            Role = UserRole.User,
            Status = UserStatus.Active,
            BirthDate = pending.BirthDate
        };

        try
        {
            _context.Add(userEntity);
            _context.PendingRegistrations.Remove(pending);
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

    protected async Task<bool> StartChangePasswordActionAsync(int userId, ChangePasswordDto data)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId && u.IsDeleted == false);
        if (user == null)
            return false;

        if (!PasswordHasher.Verify(data.CurrentPassword, user.Password))
            return false;

        var existingCodes = _context.VerificationCodes
            .Where(v => v.UserId == userId && v.Purpose == VerificationPurpose.ChangePassword);
        _context.VerificationCodes.RemoveRange(existingCodes);

        var code = GenerateCode();

        var verification = new VerificationCodeEntity
        {
            UserId = userId,
            Code = code,
            Purpose = VerificationPurpose.ChangePassword,
            PendingPasswordHash = PasswordHasher.Hash(data.NewPassword),
            ExpiresAt = DateTime.UtcNow.AddMinutes(CodeExpiryMinutes)
        };

        try
        {
            _context.Add(verification);
            await _context.SaveChangesAsync();

            await SendCodeEmailAsync(user.Email, "Confirmă schimbarea parolei",
                "Foloseste codul de mai jos ca sa confirmi schimbarea parolei contului tau FinSim.", code);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<bool> ConfirmChangePasswordActionAsync(int userId, ConfirmCodeDto data)
    {
        var verification = await _context.VerificationCodes.FirstOrDefaultAsync(v =>
            v.UserId == userId && v.Purpose == VerificationPurpose.ChangePassword);

        if (verification == null || verification.Code != data.Code || verification.ExpiresAt < DateTime.UtcNow)
            return false;

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId && u.IsDeleted == false);
        if (user == null || verification.PendingPasswordHash == null)
            return false;

        user.Password = verification.PendingPasswordHash;

        try
        {
            _context.Users.Update(user);
            _context.VerificationCodes.Remove(verification);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task ForgotPasswordActionAsync(string email)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.IsDeleted == false);
        if (user == null)
            return;

        var existingCodes = _context.VerificationCodes
            .Where(v => v.UserId == user.Id && v.Purpose == VerificationPurpose.PasswordReset);
        _context.VerificationCodes.RemoveRange(existingCodes);

        var code = GenerateCode();

        _context.Add(new VerificationCodeEntity
        {
            UserId = user.Id,
            Code = code,
            Purpose = VerificationPurpose.PasswordReset,
            ExpiresAt = DateTime.UtcNow.AddMinutes(CodeExpiryMinutes)
        });
        await _context.SaveChangesAsync();

        await SendCodeEmailAsync(user.Email, "Resetează parola",
            "Foloseste codul de mai jos ca sa iti resetezi parola contului FinSim.", code);
    }

    protected async Task<bool> ResetPasswordActionAsync(ResetPasswordDto data)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == data.Email && u.IsDeleted == false);
        if (user == null)
            return false;

        var verification = await _context.VerificationCodes.FirstOrDefaultAsync(v =>
            v.UserId == user.Id && v.Purpose == VerificationPurpose.PasswordReset);

        if (verification == null || verification.Code != data.Code || verification.ExpiresAt < DateTime.UtcNow)
            return false;

        user.Password = PasswordHasher.Hash(data.NewPassword);

        try
        {
            _context.Users.Update(user);
            _context.VerificationCodes.Remove(verification);
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

    private async Task SendCodeEmailAsync(string email, string heading, string introText, string code)
    {
        var html = EmailTemplates.BuildVerificationCodeEmail(heading, introText, code, CodeExpiryMinutes);
        await _emailSender.SendAsync(email, "Codul tau FinSim", html);
    }

    private static string GenerateCode() => RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");
}
