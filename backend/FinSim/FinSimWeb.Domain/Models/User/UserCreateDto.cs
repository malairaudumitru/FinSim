using System.ComponentModel.DataAnnotations;
using FinSim.Domain.Entities.User;

namespace FinSim.Domain.Models.User;

public class UserCreateDto
{
    [Required]
    [StringLength(15)]
    public string Nume { get; set; } = string.Empty;
    
    [Required]
    [StringLength(15)]
    public string Prenume { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(50)]
    public string Email { get; set; } = string.Empty;
    
    [StringLength(50, MinimumLength = 8)]
    public string? Password { get; set; }

    [EnumDataType(typeof(UserRole))]
    public UserRole Rol { get; set; } = UserRole.User;

    [EnumDataType(typeof(UserStatus))]
    public UserStatus Status { get; set; } = UserStatus.Activ;
    
    public int ScenariiFinalizate { get; set; } = 0;
    
    public int ScorTotal { get; set; } = 0;
    
    public DateOnly? DataNasterii { get; set; }

}