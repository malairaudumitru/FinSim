using System.ComponentModel.DataAnnotations;
using FinSim.Domain.Entities.Resources;

namespace FinSim.Domain.Models.Resources;

public class VideoResourceCreateDto
{
    [Required]
    [StringLength(500)]
    public string YoutubeId { get; set; } = string.Empty;

    [Required]
    [StringLength(150)]
    public string Titlu { get; set; } = string.Empty;

    [StringLength(150)]
    public string Sursa { get; set; } = string.Empty;

    [EnumDataType(typeof(ResourceTheme))]
    public ResourceTheme Tema { get; set; } = ResourceTheme.General;
}
