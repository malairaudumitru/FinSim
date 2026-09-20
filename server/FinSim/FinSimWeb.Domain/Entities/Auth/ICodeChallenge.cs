namespace FinSim.Domain.Entities.Auth;

/// <summary>A one-time code with an expiry and a counter of wrong attempts.</summary>
public interface ICodeChallenge
{
    string Code { get; }
    DateTime ExpiresAt { get; }
    int Attempts { get; set; }
}
