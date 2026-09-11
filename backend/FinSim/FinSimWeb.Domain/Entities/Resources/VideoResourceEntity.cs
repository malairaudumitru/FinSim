using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Entities.Resources;

public class VideoResourceEntity
{
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string YoutubeId { get; set; } = string.Empty;

    [Required]
    [StringLength(150)]
    public string Titlu { get; set; } = string.Empty;
    
    public ResourceTheme Tema { get; set; } = ResourceTheme.General;

    [StringLength(150)]
    public string Sursa { get; set; } = string.Empty;
    

    public bool IsDeleted { get; set; } = false;
}
