using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Entities.Resources;

public class PdfResourceEntity
{
    public int Id { get; set; }

    [Required]
    [StringLength(150)]
    public string Title { get; set; } = string.Empty;

    [StringLength(600)]
    public string Description { get; set; } = string.Empty;
    
    public ResourceTheme Theme { get; set; } = ResourceTheme.General;

    [Required]
    [StringLength(300)]
    public string FilePath { get; set; } = string.Empty;
    

    public bool IsDeleted { get; set; } = false;
}
