using System.Security.Claims;
using FinSim.BusinessLayer.Core;

namespace FinSim.Api.Middleware;

public static class RequestContextHelpers
{
    public static string GetUserId(HttpContext context) =>
        context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "anonim";

    public static string GetLanguage(HttpContext context) =>
        AppLanguage.Parse(context.Request.Headers.AcceptLanguage.ToString());

    public static string GetIp(HttpContext context) =>
        context.Connection.RemoteIpAddress?.ToString() ?? "necunoscut";
}
