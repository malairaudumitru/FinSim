using FinSim.Domain.Entities.Errors;
using FinSim.Domain.Models.Responses;

namespace FinSim.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var userId = RequestContextHelpers.GetUserId(context);
            var ip = RequestContextHelpers.GetIp(context);
            var errorId = Guid.NewGuid();

            _logger.LogError(ex, "Unhandled exception on {Method} {Path} (User: {UserId}, IP: {Ip}, ErrorId: {ErrorId})",
                context.Request.Method, context.Request.Path, userId, ip, errorId);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsJsonAsync(new ErrorResponse
            {
                ErrorKey = ErrorKey.InternalServerError,
                ErrorId = errorId
            });
        }
    }
}
