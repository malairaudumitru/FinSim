using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace FinSim.BusinessLayer.Core;

public class TokenService
{
    public string GenerateAccessToken(int userId, string lastName, string firstName, string role)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtSettings.SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Name, $"{firstName} {lastName}"),
            new Claim(ClaimTypes.Role, role)
        };

        var token = new JwtSecurityToken(
            issuer: JwtSettings.Issuer,
            audience: JwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(JwtSettings.AccessTokenExpireMinutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    /// <summary>Refresh tokens are stored hashed, so a leaked database cannot be used to hijack sessions.</summary>
    public static string HashRefreshToken(string token) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));

    public string GenerateRefreshToken()
    {
        var randomBytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(randomBytes);
    }
}
