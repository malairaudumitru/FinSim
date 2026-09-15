using FinSim.Domain.Entities.Resources;

namespace FinSim.Domain.Models.Resources;

public class VideoResourceInfoDto
{
    public int Id { get; set; }
    public string YoutubeId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public ResourceTheme Theme { get; set; }
    public bool IsDeleted { get; set; }
}
