using System.Net;

namespace MedicalCabinetWeb.Domain.Models.Responses;

public class ActionResponse
{
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
    public object? Data { get; set; }
    public HttpStatusCode StatusCode { get; set; }
    
    public static ActionResponse NotFound(string? message = null) => new()
    {
        IsSuccess = false,
        Message = message,
        StatusCode = HttpStatusCode.NotFound  
    };
    
    public static ActionResponse BadRequest(string? message = null) => new()
    {
        IsSuccess = false,
        Message = message,
        StatusCode = HttpStatusCode.BadRequest  
    };
    
    public static ActionResponse Ok(string? message = null, object? data = null) => new()
    {
        IsSuccess = true,
        Message = message,
        Data = data,
        StatusCode = HttpStatusCode.OK  
    };
    
}