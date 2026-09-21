using FinSim.Domain.Models.Notifications;
using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Interfaces;

public interface INotificationLogic
{
    Task<ActionResponse> CreateNotificationAsync(NotificationCreateDto data);
    Task<ActionResponse> GetNotificationListAsync(string language);
    Task<ActionResponse> GetNotificationByUserIdAsync(int userId, string language);
    Task<ActionResponse> UpdateNotificationAsync(int id, NotificationCreateDto data);
    Task<ActionResponse> UpdateReadStatusAsync(int id, int callerUserId, bool isAdmin);
    Task<ActionResponse> MarkAllAsReadAsync(int userId);
    Task<ActionResponse> DeleteNotificationAsync(int id);
}
