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

            _logger.LogError(ex, "Unhandled exception on {Method} {Path} (User: {UserId}, IP: {Ip})",
                context.Request.Method, context.Request.Path, userId, ip);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;
            await context.Response.WriteAsJsonAsync(new { message = "A apărut o eroare internă neașteptată." });
        }
    }
}
