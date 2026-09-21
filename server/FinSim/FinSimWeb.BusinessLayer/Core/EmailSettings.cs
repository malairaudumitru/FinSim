using Microsoft.Extensions.Configuration;

namespace FinSim.BusinessLayer.Core;

public static class EmailSettings
{
    private static readonly IConfiguration Configuration = new ConfigurationBuilder()
        .SetBasePath(AppContext.BaseDirectory)
        .AddJsonFile("appsettings.json", optional: false)
        .AddUserSecrets(System.Reflection.Assembly.GetEntryAssembly()!)
        .Build();

    public const string SmtpHost = "smtp.gmail.com";
    public const int SmtpPort = 587;
    public const string SenderName = "FinSim";

    public static string Address =>
        Configuration["Email:Address"]
        ?? throw new InvalidOperationException("Email:Address not configured. Add it to user-secrets.");

    public static string AppPassword =>
        Configuration["Email:AppPassword"]
        ?? throw new InvalidOperationException("Email:AppPassword not configured. Add it to user-secrets.");
}

