using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Models.Resources;

public class PdfResourceCreateDto
{
    [Required]
    [StringLength(150)]
    public string Titlu { get; set; } = string.Empty;

    [StringLength(600)]
    public string Descriere { get; set; } = string.Empty;

    [Required]
    [StringLength(300)]
    public string Fisier { get; set; } = string.Empty;

    [StringLength(50)]
    public string Tema { get; set; } = "General";
}
