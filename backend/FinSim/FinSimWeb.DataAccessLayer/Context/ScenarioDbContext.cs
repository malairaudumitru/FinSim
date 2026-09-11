using FinSim.Domain.Entities.Scenarios;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace FinSim.DataAccessLayer.Context;

public class ScenarioDbContext : DbContext
{

    public DbSet<ScenarioEntity> Scenarios { get; set; }

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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ScenarioEntity>()
            .HasIndex(s => s.Slug)
            .IsUnique();
    }
}
