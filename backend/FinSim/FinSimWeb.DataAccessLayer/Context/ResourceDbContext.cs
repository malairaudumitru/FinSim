using FinSim.Domain.Entities.Resources;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace FinSim.DataAccessLayer.Context;

public class ResourceDbContext : DbContext
{

    public DbSet<VideoResourceEntity> VideoResources { get; set; }
    public DbSet<PdfResourceEntity> PdfResources { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(AppContext.BaseDirectory)
                .AddJsonFile("appsettings.json", optional: false)
                .AddUserSecrets(System.Reflection.Assembly.GetEntryAssembly()!)
                .Build();

            optionsBuilder.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));
        }
    }
}
