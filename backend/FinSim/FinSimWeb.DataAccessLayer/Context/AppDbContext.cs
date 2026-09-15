using FinSim.Domain.Entities.Auth;
using FinSim.Domain.Entities.Leaderboard;
using FinSim.Domain.Entities.Messages;
using FinSim.Domain.Entities.Notifications;
using FinSim.Domain.Entities.Resources;
using FinSim.Domain.Entities.Reviews;
using FinSim.Domain.Entities.ScenarioHistory;
using FinSim.Domain.Entities.Scenarios;
using FinSim.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;

namespace FinSim.DataAccessLayer.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<UserEntity> Users => Set<UserEntity>();
    public DbSet<RefreshTokenEntity> RefreshTokens => Set<RefreshTokenEntity>();
    public DbSet<LeaderboardEntity> Leaderboard => Set<LeaderboardEntity>();
    public DbSet<ReviewEntity> Reviews => Set<ReviewEntity>();
    public DbSet<NotificationEntity> Notifications => Set<NotificationEntity>();
    public DbSet<VideoResourceEntity> VideoResources => Set<VideoResourceEntity>();
    public DbSet<PdfResourceEntity> PdfResources => Set<PdfResourceEntity>();
    public DbSet<ContactMessageEntity> ContactMessages => Set<ContactMessageEntity>();
    public DbSet<ScenarioEntity> Scenarios => Set<ScenarioEntity>();
    public DbSet<ScenarioHistoryEntity> ScenarioHistories => Set<ScenarioHistoryEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserEntity>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<ScenarioEntity>().HasIndex(s => s.Slug).IsUnique();
        modelBuilder.Entity<RefreshTokenEntity>().HasIndex(r => r.Token).IsUnique();

        modelBuilder.Entity<RefreshTokenEntity>()
            .HasOne(r => r.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<LeaderboardEntity>()
            .HasOne(l => l.User)
            .WithOne(u => u.Leaderboard)
            .HasForeignKey<LeaderboardEntity>(l => l.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<LeaderboardEntity>().HasIndex(l => l.UserId).IsUnique();

        modelBuilder.Entity<NotificationEntity>()
            .HasOne(n => n.User)
            .WithMany(u => u.Notifications)
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ContactMessageEntity>()
            .HasOne(c => c.User)
            .WithMany(u => u.ContactMessages)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ScenarioHistoryEntity>()
            .HasOne(sh => sh.User)
            .WithMany(u => u.ScenarioHistories)
            .HasForeignKey(sh => sh.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ScenarioHistoryEntity>()
            .HasOne(sh => sh.Scenario)
            .WithMany(s => s.Histories)
            .HasForeignKey(sh => sh.ScenarioId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
