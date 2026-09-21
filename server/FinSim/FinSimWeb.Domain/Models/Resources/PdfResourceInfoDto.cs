using FinSim.Domain.Entities.Resources;

namespace FinSim.Domain.Models.Resources;

public class PdfResourceInfoDto
{
    public int Id { get; set; }
    /// <summary>Title in the language requested through Accept-Language.</summary>
    public string Title { get; set; } = string.Empty;
    /// <summary>Description in the language requested through Accept-Language.</summary>
    public string Description { get; set; } = string.Empty;
    public string TitleRo { get; set; } = string.Empty;
    public string? TitleEn { get; set; }
    public string? TitleRu { get; set; }
    public string DescriptionRo { get; set; } = string.Empty;
    public string? DescriptionEn { get; set; }
    public string? DescriptionRu { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public ResourceTheme Theme { get; set; }
    public bool IsDeleted { get; set; }
}
