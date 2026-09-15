using System.Security.Claims;
using FinSim.BusinessLayer;
using FinSim.BusinessLayer.Interfaces;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Models.Notifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinSim.Api.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly INotificationLogic _notificationLogic;

    public NotificationController(AppDbContext context)
    {
        var bl = new BusinessLogic();
        _notificationLogic = bl.GetNotificationLogic(context);
    }

    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private bool IsAdmin => User.IsInRole("Admin");

    [HttpPost("create")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateNotification([FromBody] NotificationCreateDto notificationInfo)
    {
        var result = await _notificationLogic.CreateNotificationAsync(notificationInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpGet("list")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetNotificationList()
    {
        var result = await _notificationLogic.GetNotificationListAsync();
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpGet("by-user/{userId}")]
    public async Task<IActionResult> GetNotificationByUserId([FromRoute] int userId)
    {
        if (!IsAdmin && userId != CurrentUserId)
            return Forbid();

        var result = await _notificationLogic.GetNotificationByUserIdAsync(userId);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPut("update/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateNotification([FromRoute] int id, [FromBody] NotificationCreateDto notificationInfo)
    {
        var result = await _notificationLogic.UpdateNotificationAsync(id, notificationInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpPut("{id}/read-status")]
    public async Task<IActionResult> UpdateReadStatus([FromRoute] int id)
    {
        var result = await _notificationLogic.UpdateReadStatusAsync(id, CurrentUserId, IsAdmin);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpPut("{userId}/mark-all-read")]
    public async Task<IActionResult> MarkAllAsRead([FromRoute] int userId)
    {
        if (!IsAdmin && userId != CurrentUserId)
            return Forbid();

        var result = await _notificationLogic.MarkAllAsReadAsync(userId);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteNotification([FromRoute] int id)
    {
        var result = await _notificationLogic.DeleteNotificationAsync(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
