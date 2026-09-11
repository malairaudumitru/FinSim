using FinSim.Domain.Entities.Messages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace FinSim.DataAccessLayer.Context;

public class ContactMessageDbContext : DbContext
{

    public DbSet<ContactMessageEntity> ContactMessages { get; set; }

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
