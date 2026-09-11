using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Entities.Reviews;

public class ReviewEntity
{
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Nume { get; set; } = string.Empty;

    [Range(1, 120)]
    public int? Varsta { get; set; }

    [Required]
    [StringLength(150)]
    public string Email { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Range(1, 5)]
    public int Rating { get; set; }

    [Required]
    [StringLength(500)]
    public string Mesaj { get; set; } = string.Empty;

    public bool IsDeleted { get; set; } = false;
}