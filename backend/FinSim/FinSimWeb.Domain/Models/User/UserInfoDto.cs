using FinSim.Domain.Entities.User;

namespace FinSim.Domain.Models.User;

public class UserInfoDto
{
    public int Id { get; set; }

    public string Nume { get; set; } = string.Empty;

    public string Prenume { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public UserRole Rol { get; set; }

    public UserStatus Status { get; set; }
    
    public DateTime DataInregistrare { get; set; }
    
    public int ScenariiFinalizate { get; set; }
    
    public int ScorTotal { get; set; }
    
    public DateOnly? DataNasterii { get; set; }
    
    public bool IsDeleted { get; set; }
}