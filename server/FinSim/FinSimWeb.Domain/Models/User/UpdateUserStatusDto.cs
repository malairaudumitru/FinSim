using System.ComponentModel.DataAnnotations;
using FinSim.Domain.Entities.User;

namespace FinSim.Domain.Models.User;

public class UpdateUserStatusDto
{
    [Required]
    [EnumDataType(typeof(UserStatus))]
    public UserStatus Status { get; set; }
}
