using FinSim.BusinessLayer.Core;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Notifications;
using FinSim.Domain.Entities.User;
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
        List<int> recipientIds;
        if (data.SendToAll)
        {
            recipientIds = await _context.Users
                .Where(u => u.IsDeleted == false && u.Status == UserStatus.Active)
                .Select(u => u.Id)
                .ToListAsync();
        }
        else
        {
            var userId = await ResolveUserIdByEmailAsync(data.Email ?? string.Empty);
            recipientIds = userId == null ? [] : [userId.Value];
        }

        if (recipientIds.Count == 0)
            return false;

        try
        {
            // One notification per recipient, saved together so it is all-or-nothing.
            _context.AddRange(recipientIds.Select(recipientId => new NotificationEntity
            {
                Type = data.Type,
                MessageRo = data.MessageRo,
                MessageEn = NullIfBlank(data.MessageEn),
                MessageRu = NullIfBlank(data.MessageRu),
                UserId = recipientId
            }));
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

    protected async Task<List<NotificationInfoDto>> GetNotificationListActionAsync(string language)
    {
        return await _context.Notifications
            .Where(x => x.IsDeleted == false)
            .OrderByDescending(x => x.CreatedAt)
            .Select(notificationEntity => MapToInfoDto(notificationEntity, language))
            .ToListAsync();
    }

    protected async Task<List<NotificationInfoDto>> GetNotificationByUserIdActionAsync(int userId, string language)
    {
        return await _context.Notifications
            .Where(x => x.UserId == userId && x.IsDeleted == false)
            .OrderByDescending(x => x.CreatedAt)
            .Select(notificationEntity => MapToInfoDto(notificationEntity, language))
            .ToListAsync();
    }

    protected async Task<bool> UpdateNotificationActionAsync(int id, NotificationCreateDto data)
    {
        var notificationEntity = await _context.Notifications.FirstOrDefaultAsync(x => x.Id == id);
        if (notificationEntity == null || notificationEntity.IsDeleted)
            return false;

        var userId = await ResolveUserIdByEmailAsync(data.Email ?? string.Empty);
        if (userId == null)
            return false;

        notificationEntity.Type = data.Type;
        notificationEntity.MessageRo = data.MessageRo;
        notificationEntity.MessageEn = NullIfBlank(data.MessageEn);
        notificationEntity.MessageRu = NullIfBlank(data.MessageRu);
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

    private static string? NullIfBlank(string? value) => string.IsNullOrWhiteSpace(value) ? null : value;

    private static NotificationInfoDto MapToInfoDto(NotificationEntity notificationEntity, string language) => new()
    {
        Id = notificationEntity.Id,
        Type = notificationEntity.Type,
        Message = AppLanguage.Pick(language, notificationEntity.MessageRo, notificationEntity.MessageEn, notificationEntity.MessageRu),
        MessageRo = notificationEntity.MessageRo,
        MessageEn = notificationEntity.MessageEn,
        MessageRu = notificationEntity.MessageRu,
        CreatedAt = notificationEntity.CreatedAt,
        IsRead = notificationEntity.IsRead,
        UserId = notificationEntity.UserId,
        ContactMessageId = notificationEntity.ContactMessageId,
        IsDeleted = notificationEntity.IsDeleted
    };
}
