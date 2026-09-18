using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Models.Reviews;

public class ReviewCreateDto
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Range(1, 120)]
    public int Age { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }

    [Required]
    [StringLength(500)]
    public string Message { get; set; } = string.Empty;
}