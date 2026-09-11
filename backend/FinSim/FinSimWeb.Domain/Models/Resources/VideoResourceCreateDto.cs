using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Models.Resources;

public class VideoResourceCreateDto
{
    [Required]
    [StringLength(50)]
    public string YoutubeId { get; set; } = string.Empty;

    [Required]
    [StringLength(150)]
    public string Titlu { get; set; } = string.Empty;

    [StringLength(150)]
    public string Sursa { get; set; } = string.Empty;

    [StringLength(50)]
    public string Tema { get; set; } = "General";
}
