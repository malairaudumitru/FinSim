using FinSim.Domain.Entities.Errors;

namespace FinSim.Domain.Models.Responses;

public class ErrorResponse
{
    public ErrorKey ErrorKey { get; set; }
    public Guid ErrorId { get; set; }
}
