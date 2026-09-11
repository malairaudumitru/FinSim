using FinSim.Domain.Entities.Resources;

namespace FinSim.Domain.Models.Resources;

public class VideoResourceInfoDto
{
    public int Id { get; set; }
    public string YoutubeId { get; set; } = string.Empty;
    public string Titlu { get; set; } = string.Empty;
    public string Sursa { get; set; } = string.Empty;
    public ResourceTheme Tema { get; set; }
    public bool IsDeleted { get; set; }
}
