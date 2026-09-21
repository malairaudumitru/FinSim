using System.ComponentModel.DataAnnotations;
using FinSim.Domain.Entities.Resources;

namespace FinSim.Domain.Models.Resources;

public class PdfResourceCreateDto
{
    [Required]
    [StringLength(150)]
    public string TitleRo { get; set; } = string.Empty;

    [StringLength(150)]
    public string? TitleEn { get; set; }

    [StringLength(150)]
    public string? TitleRu { get; set; }

    [StringLength(600)]
    public string DescriptionRo { get; set; } = string.Empty;

    [StringLength(600)]
    public string? DescriptionEn { get; set; }

    [StringLength(600)]
    public string? DescriptionRu { get; set; }

    [Required]
    [StringLength(300)]
    public string FilePath { get; set; } = string.Empty;

    [EnumDataType(typeof(ResourceTheme))]
    public ResourceTheme Theme { get; set; } = ResourceTheme.General;
}
