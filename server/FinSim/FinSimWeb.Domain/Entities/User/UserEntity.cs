using System.ComponentModel.DataAnnotations;
using FinSim.Domain.Entities.Auth;
using FinSim.Domain.Entities.Leaderboard;
using FinSim.Domain.Entities.Messages;
using FinSim.Domain.Entities.Notifications;
using FinSim.Domain.Entities.ScenarioHistory;

namespace FinSim.Domain.Entities.User;

public class UserEntity
{
    public int Id { get; set; }

    [Required]
    [StringLength(15)]
    public string LastName { get; set; }

    [Required]
    [StringLength(15)]
    public string FirstName { get; set; }

    [Required]
    [StringLength(50)]
    public string Email { get; set; }


    [Required]
    [StringLength(100)]
    public string Password { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.User;

    public UserStatus Status { get; set; } = UserStatus.Active;

    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;

    public int CompletedScenarios { get; set; } = 0;

    public int TotalScore { get; set; } = 0;

    public DateOnly? BirthDate { get; set; }

    public bool IsDeleted { get; set; }

    public int FailedLoginAttempts { get; set; }

    public DateTime? LockoutEnd { get; set; }

    public ICollection<RefreshTokenEntity> RefreshTokens { get; set; } = new List<RefreshTokenEntity>();
    public LeaderboardEntity? Leaderboard { get; set; }
    public ICollection<NotificationEntity> Notifications { get; set; } = new List<NotificationEntity>();
    public ICollection<ContactMessageEntity> ContactMessages { get; set; } = new List<ContactMessageEntity>();
    public ICollection<ScenarioHistoryEntity> ScenarioHistories { get; set; } = new List<ScenarioHistoryEntity>();
    public ICollection<VerificationCodeEntity> VerificationCodes { get; set; } = new List<VerificationCodeEntity>();
}