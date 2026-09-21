using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Entities.Resources;

public class PdfResourceEntity
{
    public int Id { get; set; }

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
    
    public ResourceTheme Theme { get; set; } = ResourceTheme.General;

    [Required]
    [StringLength(300)]
    public string FilePath { get; set; } = string.Empty;
    

    public bool IsDeleted { get; set; } = false;
}
