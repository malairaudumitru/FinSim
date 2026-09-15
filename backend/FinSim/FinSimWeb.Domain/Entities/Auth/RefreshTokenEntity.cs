using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Entities.Auth;

public class RefreshTokenEntity
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    [StringLength(200)]
    public string Token { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? RevokedAt { get; set; }
}
