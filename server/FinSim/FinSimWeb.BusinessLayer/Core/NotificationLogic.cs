using FinSim.BusinessLayer.Interfaces;
using FinSim.BusinessLayer.Structure;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Models.Notifications;
using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Core;

public class NotificationLogic : NotificationAction, INotificationLogic
{
    public NotificationLogic(AppDbContext context) : base(context) { }

    public async Task<ActionResponse> CreateNotificationAsync(NotificationCreateDto data)
    {
        var result = await CreateNotificationActionAsync(data);
        if (result == false)
            return ActionResponse.BadRequest("Error creating notification — check that the email belongs to an existing user");
        return ActionResponse.Ok("Notification created successfully");
    }

    public async Task<ActionResponse> GetNotificationListAsync(string language)
    {
        var result = await GetNotificationListActionAsync(language);
        return ActionResponse.Ok(data: result);
    }

    public async Task<ActionResponse> GetNotificationByUserIdAsync(int userId, string language)
    {
        var result = await GetNotificationByUserIdActionAsync(userId, language);
        return ActionResponse.Ok(data: result);
    }

    public async Task<ActionResponse> UpdateNotificationAsync(int id, NotificationCreateDto data)
    {
        var result = await UpdateNotificationActionAsync(id, data);
        if (result == false)
            return ActionResponse.BadRequest("Error updating notification");
        return ActionResponse.Ok("Notification updated successfully");
    }

    public async Task<ActionResponse> UpdateReadStatusAsync(int id, int callerUserId, bool isAdmin)
    {
        var ownerUserId = await GetNotificationOwnerUserIdActionAsync(id);
        if (ownerUserId == null)
            return ActionResponse.NotFound("Notification not found");
        if (!isAdmin && ownerUserId != callerUserId)
            return ActionResponse.Forbidden("You can only mark your own notifications as read");

        var result = await UpdateReadStatusActionAsync(id);
        if (result == false)
            return ActionResponse.BadRequest("Error marking notification as read");
        return ActionResponse.Ok("Notification marked as read");
    }

    public async Task<ActionResponse> MarkAllAsReadAsync(int userId)
    {
        var result = await MarkAllAsReadActionAsync(userId);
        if (result == false)
            return ActionResponse.BadRequest("Error marking notifications as read");
        return ActionResponse.Ok("All notifications marked as read");
    }

    public async Task<ActionResponse> DeleteNotificationAsync(int id)
    {
        var result = await DeleteNotificationActionAsync(id);
        if (result == false)
            return ActionResponse.NotFound("Notification not found");
        return ActionResponse.Ok("Notification deleted successfully");
    }
}
