using FinSim.Domain.Models.Auth;

namespace FinSim.BusinessLayer.Structure;

public enum LoginStatus
{
    Success,
    InvalidCredentials,
    Locked
}

public record LoginOutcome(LoginStatus Status, AuthResponseDto? Auth = null);
