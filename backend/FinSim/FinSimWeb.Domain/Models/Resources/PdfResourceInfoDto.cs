using FinSim.Domain.Entities.Resources;

namespace FinSim.Domain.Models.Resources;

public class PdfResourceInfoDto
{
    public int Id { get; set; }
    public string Titlu { get; set; } = string.Empty;
    public string Descriere { get; set; } = string.Empty;
    public string Fisier { get; set; } = string.Empty;
    public ResourceTheme Tema { get; set; }
    public bool IsDeleted { get; set; }
}
