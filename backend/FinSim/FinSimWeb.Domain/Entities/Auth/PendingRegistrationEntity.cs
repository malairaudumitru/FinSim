using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Entities.Auth;

public class PendingRegistrationEntity
{
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(15)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(15)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string PasswordHash { get; set; } = string.Empty;

    public DateOnly BirthDate { get; set; }

    [Required]
    [StringLength(6)]
    public string Code { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
