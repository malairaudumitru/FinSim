using FinSim.Domain.Entities.User;

namespace FinSim.Domain.Models.User;

public class UserInfoDto
{
    public int Id { get; set; }

    public string LastName { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public UserRole Role { get; set; }

    public UserStatus Status { get; set; }
    
    public DateTime RegisteredAt { get; set; }
    
    public int CompletedScenarios { get; set; }
    
    public int TotalScore { get; set; }
    
    public DateOnly? BirthDate { get; set; }
    
    public bool IsDeleted { get; set; }
}