using System.Security.Cryptography;
using System.Text;
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
    private const int MaxCodeAttempts = 5;
    private const int MaxLoginAttempts = 5;
    private const int LoginLockoutMinutes = 15;

    public AuthAction(AppDbContext context)
    {
        _context = context;
    }

    protected async Task<bool> StartRegisterActionAsync(UserRegisterDto data, string language)
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

            await SendCodeEmailAsync(data.Email, CodeEmailKind.Register, language, code);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<CodeResult> ConfirmRegisterActionAsync(RegisterConfirmDto data)
    {
        var pending = await _context.PendingRegistrations.FirstOrDefaultAsync(p => p.Email == data.Email);
        if (pending == null)
            return CodeResult.Invalid;

        var check = await ValidateCodeAsync(pending, data.Code);
        if (check != CodeResult.Ok)
            return check;

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
            return CodeResult.Ok;
        }
        catch (Exception)
        {
            return CodeResult.Invalid;
        }
    }

    protected async Task<LoginOutcome> LoginActionAsync(UserLoginDto data)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == data.Email && u.IsDeleted == false);

        if (user == null || user.Status == UserStatus.Blocked)
            return new LoginOutcome(LoginStatus.InvalidCredentials);

        // While locked, even the correct password is refused, so guessing gains nothing.
        if (user.LockoutEnd != null && user.LockoutEnd > DateTime.UtcNow)
            return new LoginOutcome(LoginStatus.Locked);

        if (!PasswordHasher.Verify(data.Password, user.Password))
        {
            user.FailedLoginAttempts++;
            var locked = user.FailedLoginAttempts >= MaxLoginAttempts;
            if (locked)
            {
                user.LockoutEnd = DateTime.UtcNow.AddMinutes(LoginLockoutMinutes);
                user.FailedLoginAttempts = 0;
            }

            await _context.SaveChangesAsync();
            return new LoginOutcome(locked ? LoginStatus.Locked : LoginStatus.InvalidCredentials);
        }

        // Saved together with the new refresh token in GenerateAuthResponseAsync.
        user.FailedLoginAttempts = 0;
        user.LockoutEnd = null;

        return new LoginOutcome(LoginStatus.Success, await GenerateAuthResponseAsync(user));
    }

    protected async Task<AuthResponseDto?> RefreshActionAsync(string refreshToken)
    {
        var tokenHash = TokenService.HashRefreshToken(refreshToken);
        var storedToken = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == tokenHash);

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

    protected async Task<bool> StartChangePasswordActionAsync(int userId, ChangePasswordDto data, string language)
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

            await SendCodeEmailAsync(user.Email, CodeEmailKind.ChangePassword, language, code);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<CodeResult> ConfirmChangePasswordActionAsync(int userId, ConfirmCodeDto data)
    {
        var verification = await _context.VerificationCodes.FirstOrDefaultAsync(v =>
            v.UserId == userId && v.Purpose == VerificationPurpose.ChangePassword);

        if (verification == null)
            return CodeResult.Invalid;

        var check = await ValidateCodeAsync(verification, data.Code);
        if (check != CodeResult.Ok)
            return check;

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId && u.IsDeleted == false);
        if (user == null || verification.PendingPasswordHash == null)
            return CodeResult.Invalid;

        user.Password = verification.PendingPasswordHash;
        user.FailedLoginAttempts = 0;
        user.LockoutEnd = null;

        try
        {
            _context.Users.Update(user);
            _context.VerificationCodes.Remove(verification);
            await _context.RevokeAllRefreshTokensAsync(user.Id);
            await _context.SaveChangesAsync();
            return CodeResult.Ok;
        }
        catch (Exception)
        {
            return CodeResult.Invalid;
        }
    }

    protected async Task ForgotPasswordActionAsync(string email, string language)
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

        await SendCodeEmailAsync(user.Email, CodeEmailKind.ResetPassword, language, code);
    }

    protected async Task<CodeResult> VerifyResetCodeActionAsync(VerifyResetCodeDto data)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == data.Email && u.IsDeleted == false);
        if (user == null)
            return CodeResult.Invalid;

        var verification = await _context.VerificationCodes.FirstOrDefaultAsync(v =>
            v.UserId == user.Id && v.Purpose == VerificationPurpose.PasswordReset);

        if (verification == null)
            return CodeResult.Invalid;

        var check = await ValidateCodeAsync(verification, data.Code);
        if (check != CodeResult.Ok)
            return check;

        return CodeResult.Ok;
    }

    protected async Task<CodeResult> ResetPasswordActionAsync(ResetPasswordDto data)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == data.Email && u.IsDeleted == false);
        if (user == null)
            return CodeResult.Invalid;

        var verification = await _context.VerificationCodes.FirstOrDefaultAsync(v =>
            v.UserId == user.Id && v.Purpose == VerificationPurpose.PasswordReset);

        if (verification == null)
            return CodeResult.Invalid;

        var check = await ValidateCodeAsync(verification, data.Code);
        if (check != CodeResult.Ok)
            return check;

        user.Password = PasswordHasher.Hash(data.NewPassword);
        user.FailedLoginAttempts = 0;
        user.LockoutEnd = null;

        try
        {
            _context.Users.Update(user);
            _context.VerificationCodes.Remove(verification);
            await _context.RevokeAllRefreshTokensAsync(user.Id);
            await _context.SaveChangesAsync();
            return CodeResult.Ok;
        }
        catch (Exception)
        {
            return CodeResult.Invalid;
        }
    }

    protected async Task<bool> LogoutActionAsync(string refreshToken)
    {
        var tokenHash = TokenService.HashRefreshToken(refreshToken);
        var storedToken = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == tokenHash);
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
            Token = TokenService.HashRefreshToken(refreshTokenValue),
            ExpiresAt = DateTime.UtcNow.AddDays(JwtSettings.RefreshTokenExpireDays)
        });
        await _context.SaveChangesAsync();

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue
        };
    }

    private async Task SendCodeEmailAsync(string email, CodeEmailKind kind, string language, string code)
    {
        var content = EmailTexts.Get(kind, language, CodeExpiryMinutes);
        var html = EmailTemplates.BuildVerificationCodeEmail(content.Heading, content.Intro, code, content.Footer);
        await _emailSender.SendAsync(email, content.Subject, html);
    }

    /// <summary>
    /// Checks a submitted code. A wrong code counts as an attempt; after <see cref="MaxCodeAttempts"/>
    /// misses the code is locked (even the right code is refused) until a new one is requested,
    /// so a 6-digit code cannot be brute-forced within its lifetime.
    /// </summary>
    private async Task<CodeResult> ValidateCodeAsync(ICodeChallenge challenge, string submittedCode)
    {
        if (challenge.ExpiresAt < DateTime.UtcNow)
            return CodeResult.Invalid;

        if (challenge.Attempts >= MaxCodeAttempts)
            return CodeResult.TooManyAttempts;

        var matches = CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(challenge.Code),
            Encoding.UTF8.GetBytes(submittedCode ?? string.Empty));
        if (matches)
            return CodeResult.Ok;

        challenge.Attempts++;
        await _context.SaveChangesAsync();

        return challenge.Attempts >= MaxCodeAttempts ? CodeResult.TooManyAttempts : CodeResult.Invalid;
    }

    private static string GenerateCode() => RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");
}
