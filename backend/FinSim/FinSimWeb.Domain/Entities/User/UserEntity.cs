using System.ComponentModel.DataAnnotations;

namespace FinSim.Domain.Entities.User;

public class UserEntity
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(15)]
    public string Nume { get; set; }
    
    [Required]
    [StringLength(15)]
    public string Prenume { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Email { get; set; }
    
    
    [Required]
    [StringLength(50, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;
    
    public UserRole Rol { get; set; } = UserRole.User;
 
    public UserStatus Status { get; set; } = UserStatus.Activ;
    
    public DateTime DataInregistrare { get; set; } = DateTime.UtcNow;

    public int ScenariiFinalizate { get; set; } = 0;
    
    public int ScorTotal { get; set; } = 0;
    
    public DateOnly? DataNasterii { get; set; }
    
    public bool IsDeleted { get; set; }
}