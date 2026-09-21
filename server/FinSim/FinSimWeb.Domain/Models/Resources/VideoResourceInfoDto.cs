using FinSim.Domain.Entities.Resources;

namespace FinSim.Domain.Models.Resources;

public class VideoResourceInfoDto
{
    public int Id { get; set; }
    public string YoutubeId { get; set; } = string.Empty;
    /// <summary>Title in the language requested through Accept-Language.</summary>
    public string Title { get; set; } = string.Empty;
    public string TitleRo { get; set; } = string.Empty;
    public string? TitleEn { get; set; }
    public string? TitleRu { get; set; }
    public string Source { get; set; } = string.Empty;
    public ResourceTheme Theme { get; set; }
    public bool IsDeleted { get; set; }
}
