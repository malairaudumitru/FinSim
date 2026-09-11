using FinSim.Domain.Entities.ScenarioHistory;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace FinSim.DataAccessLayer.Context;

public class ScenarioHistoryDbContext : DbContext
{

    public DbSet<ScenarioHistoryEntity> ScenarioHistories { get; set; }

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
