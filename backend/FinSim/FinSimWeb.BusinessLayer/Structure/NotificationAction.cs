using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Notifications;
using FinSim.Domain.Models.Notifications;
using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Structure;

public class NotificationAction
{
    private readonly NotificationDbContext _context = new();

    protected bool CreateNotificationAction(NotificationCreateDto data)
    {
        var userId = ResolveUserIdByEmail(data.Email);
        if (userId == null)
            return false;

        var notificationEntity = new NotificationEntity
        {
            Tip = data.Tip,
            Mesaj = data.Mesaj,
            UserId = userId.Value
        };

        try
        {
            _context.Add(notificationEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private static int? ResolveUserIdByEmail(string email)
    {
        using var userContext = new UserDbContext();
        var user = userContext.Users.FirstOrDefault(u => u.Email == email && u.IsDeleted == false);
        return user?.Id;
    }

    protected List<NotificationInfoDto> GetNotificationListAction()
    {
        return _context.Notifications
            .Where(x => x.IsDeleted == false)
            .OrderByDescending(x => x.CreatedAt)
            .Select(notificationEntity => MapToInfoDto(notificationEntity))
            .ToList();
    }

    protected List<NotificationInfoDto> GetNotificationByUserIdAction(int userId)
    {
        return _context.Notifications
            .Where(x => x.UserId == userId && x.IsDeleted == false)
            .OrderByDescending(x => x.CreatedAt)
            .Select(notificationEntity => MapToInfoDto(notificationEntity))
            .ToList();
    }

    protected bool UpdateNotificationAction(int id, NotificationCreateDto data)
    {
        var notificationEntity = _context.Notifications.Find(id);
        if (notificationEntity == null || notificationEntity.IsDeleted)
            return false;

        var userId = ResolveUserIdByEmail(data.Email);
        if (userId == null)
            return false;

        notificationEntity.Tip = data.Tip;
        notificationEntity.Mesaj = data.Mesaj;
        notificationEntity.UserId = userId.Value;

        try
        {
            _context.Notifications.Update(notificationEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected int? GetNotificationOwnerUserIdAction(int id)
    {
        var notificationEntity = _context.Notifications.Find(id);
        if (notificationEntity == null || notificationEntity.IsDeleted)
            return null;

        return notificationEntity.UserId;
    }

    protected bool UpdateReadStatusAction(int id)
    {
        var notificationEntity = _context.Notifications.Find(id);
        if (notificationEntity == null || notificationEntity.IsDeleted)
            return false;

        notificationEntity.Citit = true;

        try
        {
            _context.Notifications.Update(notificationEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected bool MarkAllAsReadAction(int userId)
    {
        var notifications = _context.Notifications
            .Where(x => x.UserId == userId && x.IsDeleted == false && x.Citit == false)
            .ToList();

        foreach (var notificationEntity in notifications)
            notificationEntity.Citit = true;

        try
        {
            _context.Notifications.UpdateRange(notifications);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected bool DeleteNotificationAction(int id)
    {
        var notificationEntity = _context.Notifications.Find(id);
        if (notificationEntity == null)
            return false;

        try
        {
            notificationEntity.IsDeleted = true;
            _context.Notifications.Update(notificationEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private static NotificationInfoDto MapToInfoDto(NotificationEntity notificationEntity) => new()
    {
        Id = notificationEntity.Id,
        Tip = notificationEntity.Tip,
        Mesaj = notificationEntity.Mesaj,
        CreatedAt = notificationEntity.CreatedAt,
        Citit = notificationEntity.Citit,
        UserId = notificationEntity.UserId,
        IsDeleted = notificationEntity.IsDeleted
    };
}
