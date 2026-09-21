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
    public string TitleRo { get; set; } = string.Empty;

    [StringLength(150)]
    public string? TitleEn { get; set; }

    [StringLength(150)]
    public string? TitleRu { get; set; }

    [StringLength(150)]
    public string Source { get; set; } = string.Empty;

    [EnumDataType(typeof(ResourceTheme))]
    public ResourceTheme Theme { get; set; } = ResourceTheme.General;
}
