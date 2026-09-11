using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Models.Reviews;

public class ReviewCreateDto
{
    [Required]
    [StringLength(50)]
    public string Nume { get; set; } = string.Empty;

    [Range(1, 120)]
    public int? Varsta { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }

    [Required]
    [StringLength(500)]
    public string Mesaj { get; set; } = string.Empty;
}