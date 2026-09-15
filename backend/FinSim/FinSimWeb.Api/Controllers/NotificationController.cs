using System.Security.Claims;
using FinSim.BusinessLayer;
using FinSim.BusinessLayer.Interfaces;
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

    public NotificationController()
    {
        var bl = new BusinessLogic();
        _notificationLogic = bl.GetNotificationLogic();
    }

    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private bool IsAdmin => User.IsInRole("Admin");

    [HttpPost("create")]
    [Authorize(Roles = "Admin")]
    public IActionResult CreateNotification([FromBody] NotificationCreateDto notificationInfo)
    {
        var result = _notificationLogic.CreateNotification(notificationInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpGet("list")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetNotificationList()
    {
        var result = _notificationLogic.GetNotificationList();
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpGet("by-user/{userId}")]
    public IActionResult GetNotificationByUserId([FromRoute] int userId)
    {
        if (!IsAdmin && userId != CurrentUserId)
            return Forbid();

        var result = _notificationLogic.GetNotificationByUserId(userId);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPut("update/{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult UpdateNotification([FromRoute] int id, [FromBody] NotificationCreateDto notificationInfo)
    {
        var result = _notificationLogic.UpdateNotification(id, notificationInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpPut("{id}/read-status")]
    public IActionResult UpdateReadStatus([FromRoute] int id)
    {
        var result = _notificationLogic.UpdateReadStatus(id, CurrentUserId, IsAdmin);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpPut("{userId}/mark-all-read")]
    public IActionResult MarkAllAsRead([FromRoute] int userId)
    {
        if (!IsAdmin && userId != CurrentUserId)
            return Forbid();

        var result = _notificationLogic.MarkAllAsRead(userId);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteNotification([FromRoute] int id)
    {
        var result = _notificationLogic.DeleteNotification(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
