using System.Text.Json.Serialization;

namespace FinSim.Domain.Entities.Errors;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum ErrorKey
{
    InternalServerError = 0
}
