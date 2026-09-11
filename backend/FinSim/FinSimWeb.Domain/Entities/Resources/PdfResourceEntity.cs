using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Entities.Resources;

public class PdfResourceEntity
{
    public int Id { get; set; }

    [Required]
    [StringLength(150)]
    public string Titlu { get; set; } = string.Empty;

    [StringLength(600)]
    public string Descriere { get; set; } = string.Empty;
    
    [StringLength(50)]
    public string Tema { get; set; } = "General";

    [Required]
    [StringLength(300)]
    public string Fisier { get; set; } = string.Empty;
    

    public bool IsDeleted { get; set; } = false;
}
