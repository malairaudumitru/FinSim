using FinSim.BusinessLayer.Interfaces;
using FinSim.BusinessLayer.Structure;
using FinSim.Domain.Models.Notifications;
using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Core;

public class NotificationLogic : NotificationAction, INotificationLogic
{
    public ActionResponse CreateNotification(NotificationCreateDto data)
    {
        var result = CreateNotificationAction(data);
        if (result == false)
            return ActionResponse.BadRequest("Error creating notification — check that the email belongs to an existing user");
        return ActionResponse.Ok("Notification created successfully");
    }

    public ActionResponse GetNotificationList()
    {
        var result = GetNotificationListAction();
        return ActionResponse.Ok(data: result);
    }

    public ActionResponse GetNotificationByUserId(int userId)
    {
        var result = GetNotificationByUserIdAction(userId);
        return ActionResponse.Ok(data: result);
    }

    public ActionResponse UpdateNotification(int id, NotificationCreateDto data)
    {
        var result = UpdateNotificationAction(id, data);
        if (result == false)
            return ActionResponse.BadRequest("Error updating notification");
        return ActionResponse.Ok("Notification updated successfully");
    }

    public ActionResponse UpdateReadStatus(int id)
    {
        var result = UpdateReadStatusAction(id);
        if (result == false)
            return ActionResponse.NotFound("Notification not found");
        return ActionResponse.Ok("Notification marked as read");
    }

    public ActionResponse MarkAllAsRead(int userId)
    {
        var result = MarkAllAsReadAction(userId);
        if (result == false)
            return ActionResponse.BadRequest("Error marking notifications as read");
        return ActionResponse.Ok("All notifications marked as read");
    }

    public ActionResponse DeleteNotification(int id)
    {
        var result = DeleteNotificationAction(id);
        if (result == false)
            return ActionResponse.NotFound("Notification not found");
        return ActionResponse.Ok("Notification deleted successfully");
    }
}
