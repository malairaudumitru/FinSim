using FinSim.Domain.Models.Notifications;
using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Interfaces;

public interface INotificationLogic
{
    ActionResponse CreateNotification(NotificationCreateDto data);
    ActionResponse GetNotificationList();
    ActionResponse GetNotificationByUserId(int userId);
    ActionResponse UpdateNotification(int id, NotificationCreateDto data);
    ActionResponse UpdateReadStatus(int id, int callerUserId, bool isAdmin);
    ActionResponse MarkAllAsRead(int userId);
    ActionResponse DeleteNotification(int id);
}
