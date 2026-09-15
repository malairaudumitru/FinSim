using Microsoft.Extensions.Configuration;

namespace FinSim.BusinessLayer.Core;

public static class JwtSettings
{
    private static readonly IConfiguration Configuration = new ConfigurationBuilder()
        .SetBasePath(AppContext.BaseDirectory)
        .AddJsonFile("appsettings.json", optional: false)
        .AddUserSecrets(System.Reflection.Assembly.GetEntryAssembly()!)
        .Build();

    public const string Issuer = "FinSimApi";
    public const string Audience = "FinSimClients";
    public const int AccessTokenExpireMinutes = 30;
    public const int RefreshTokenExpireDays = 7;

    public static string SecretKey =>
        Configuration["Jwt:SecretKey"]
        ?? throw new InvalidOperationException("Jwt:SecretKey not configured. Add it to user-secrets.");
}
