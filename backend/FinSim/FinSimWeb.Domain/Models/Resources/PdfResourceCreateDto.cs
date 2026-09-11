using System.ComponentModel.DataAnnotations;
using FinSim.Domain.Entities.Resources;

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

    public ResourceTheme Tema { get; set; } = ResourceTheme.General;
}
