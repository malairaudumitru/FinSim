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
    public string Title { get; set; } = string.Empty;
    
    public ResourceTheme Theme { get; set; } = ResourceTheme.General;

    [StringLength(150)]
    public string Source { get; set; } = string.Empty;
    

    public bool IsDeleted { get; set; } = false;
}
