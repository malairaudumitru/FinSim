using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Notifications;
using FinSim.Domain.Models.Notifications;
using FinSim.Domain.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace FinSim.BusinessLayer.Structure;

public class NotificationAction
{
    protected readonly AppDbContext _context;

    public NotificationAction(AppDbContext context)
    {
        _context = context;
    }

    protected async Task<bool> CreateNotificationActionAsync(NotificationCreateDto data)
    {
        var userId = await ResolveUserIdByEmailAsync(data.Email);
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
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private async Task<int?> ResolveUserIdByEmailAsync(string email)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.IsDeleted == false);
        return user?.Id;
    }

    protected async Task<List<NotificationInfoDto>> GetNotificationListActionAsync()
    {
        return await _context.Notifications
            .Where(x => x.IsDeleted == false)
            .OrderByDescending(x => x.CreatedAt)
            .Select(notificationEntity => MapToInfoDto(notificationEntity))
            .ToListAsync();
    }

    protected async Task<List<NotificationInfoDto>> GetNotificationByUserIdActionAsync(int userId)
    {
        return await _context.Notifications
            .Where(x => x.UserId == userId && x.IsDeleted == false)
            .OrderByDescending(x => x.CreatedAt)
            .Select(notificationEntity => MapToInfoDto(notificationEntity))
            .ToListAsync();
    }

    protected async Task<bool> UpdateNotificationActionAsync(int id, NotificationCreateDto data)
    {
        var notificationEntity = await _context.Notifications.FirstOrDefaultAsync(x => x.Id == id);
        if (notificationEntity == null || notificationEntity.IsDeleted)
            return false;

        var userId = await ResolveUserIdByEmailAsync(data.Email);
        if (userId == null)
            return false;

        notificationEntity.Type = data.Type;
        notificationEntity.Message = data.Message;
        notificationEntity.UserId = userId.Value;

        try
        {
            _context.Notifications.Update(notificationEntity);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<int?> GetNotificationOwnerUserIdActionAsync(int id)
    {
        var notificationEntity = await _context.Notifications.FirstOrDefaultAsync(x => x.Id == id);
        if (notificationEntity == null || notificationEntity.IsDeleted)
            return null;

        return notificationEntity.UserId;
    }

    protected async Task<bool> UpdateReadStatusActionAsync(int id)
    {
        var notificationEntity = await _context.Notifications.FirstOrDefaultAsync(x => x.Id == id);
        if (notificationEntity == null || notificationEntity.IsDeleted)
            return false;

        notificationEntity.IsRead = true;

        try
        {
            _context.Notifications.Update(notificationEntity);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<bool> MarkAllAsReadActionAsync(int userId)
    {
        var notifications = await _context.Notifications
            .Where(x => x.UserId == userId && x.IsDeleted == false && x.IsRead == false)
            .ToListAsync();

        foreach (var notificationEntity in notifications)
            notificationEntity.IsRead = true;

        try
        {
            _context.Notifications.UpdateRange(notifications);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<bool> DeleteNotificationActionAsync(int id)
    {
        var notificationEntity = await _context.Notifications.FirstOrDefaultAsync(x => x.Id == id);
        if (notificationEntity == null)
            return false;

        try
        {
            notificationEntity.IsDeleted = true;
            _context.Notifications.Update(notificationEntity);
            await _context.SaveChangesAsync();
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
