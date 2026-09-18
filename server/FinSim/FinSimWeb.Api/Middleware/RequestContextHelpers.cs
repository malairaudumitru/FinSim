using System.Security.Claims;

namespace FinSim.Api.Middleware;

public static class RequestContextHelpers
{
    public static string GetUserId(HttpContext context) =>
        context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "anonim";

    public static string GetIp(HttpContext context) =>
        context.Connection.RemoteIpAddress?.ToString() ?? "necunoscut";
}
