using System.ComponentModel.DataAnnotations;
using FinSim.Domain.Entities.Resources;

namespace FinSim.Domain.Models.Resources;

public class PdfResourceCreateDto
{
    [Required]
    [StringLength(150)]
    public string Title { get; set; } = string.Empty;

    [StringLength(600)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [StringLength(300)]
    public string FilePath { get; set; } = string.Empty;

    [EnumDataType(typeof(ResourceTheme))]
    public ResourceTheme Theme { get; set; } = ResourceTheme.General;
}
