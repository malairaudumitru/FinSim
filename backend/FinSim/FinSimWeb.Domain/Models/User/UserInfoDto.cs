namespace FinSim.Domain.Models.User;

public class UserInfoDto
{
    public int Id { get; set; }
    
    public string Nume { get; set; } = string.Empty;
    
    public string Prenume { get; set; } = string.Empty;
    
    public string Email { get; set; } = string.Empty;
    
    public string Rol { get; set; } = string.Empty;
    
    public string Status { get; set; } = string.Empty;
    
    public DateTime DataInregistrare { get; set; }
    
    public int ScenariiFinalizate { get; set; }
    
    public int ScorTotal { get; set; }
    
    public int? Zi { get; set; }
    
    public int? Luna { get; set; }
    
    public int? An { get; set; }
    
    public bool IsDeleted { get; set; }
}