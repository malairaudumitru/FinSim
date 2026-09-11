namespace FinSim.Domain.Models.Resources;

public class VideoResourceInfoDto
{
    public int Id { get; set; }
    public string YoutubeId { get; set; } = string.Empty;
    public string Titlu { get; set; } = string.Empty;
    public string Sursa { get; set; } = string.Empty;
    public string Tema { get; set; } = string.Empty;
    public bool IsDeleted { get; set; }
}
