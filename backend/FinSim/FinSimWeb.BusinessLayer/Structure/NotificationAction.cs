using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Notifications;
using FinSim.Domain.Models.Notifications;
using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Structure;

public class NotificationAction
{
    protected readonly AppDbContext _context;

    public NotificationAction(AppDbContext context)
    {
        _context = context;
    }

    protected bool CreateNotificationAction(NotificationCreateDto data)
    {
        var userId = ResolveUserIdByEmail(data.Email);
        if (userId == null)
            return false;

        var notificationEntity = new NotificationEntity
        {
            Type = data.Type,
            Message = data.Message,
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

    private int? ResolveUserIdByEmail(string email)
    {
        var user = _context.Users.FirstOrDefault(u => u.Email == email && u.IsDeleted == false);
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

        notificationEntity.Type = data.Type;
        notificationEntity.Message = data.Message;
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

        notificationEntity.IsRead = true;

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
            .Where(x => x.UserId == userId && x.IsDeleted == false && x.IsRead == false)
            .ToList();

        foreach (var notificationEntity in notifications)
            notificationEntity.IsRead = true;

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
        Type = notificationEntity.Type,
        Message = notificationEntity.Message,
        CreatedAt = notificationEntity.CreatedAt,
        IsRead = notificationEntity.IsRead,
        UserId = notificationEntity.UserId,
        IsDeleted = notificationEntity.IsDeleted
    };
}
