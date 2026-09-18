using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Messages;
using FinSim.Domain.Entities.Notifications;
using FinSim.Domain.Models.Messages;
using Microsoft.EntityFrameworkCore;

namespace FinSim.BusinessLayer.Structure;

public class ContactMessageAction
{
    protected readonly AppDbContext _context;

    public ContactMessageAction(AppDbContext context)
    {
        _context = context;
    }

    protected async Task<bool> CreateContactMessageActionAsync(int userId, ContactMessageCreateDto data)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId && u.IsDeleted == false);
        if (user == null)
            return false;

        var contactMessageEntity = new ContactMessageEntity
        {
            Name = $"{user.FirstName} {user.LastName}",
            Email = user.Email,
            Message = data.Message,
            UserId = userId
        };

        try
        {
            _context.Add(contactMessageEntity);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<List<ContactMessageInfoDto>> GetContactMessageListActionAsync()
    {
        return await _context.ContactMessages
            .Where(x => x.IsDeleted == false)
            .OrderByDescending(x => x.CreatedAt)
            .Select(contactMessageEntity => MapToInfoDto(contactMessageEntity))
            .ToListAsync();
    }

    protected async Task<ContactMessageInfoDto?> GetContactMessageByIdActionAsync(int id)
    {
        var contactMessageEntity = await _context.ContactMessages
            .FirstOrDefaultAsync(x => x.Id == id && x.IsDeleted == false);
        if (contactMessageEntity == null)
            return null;

        if (!contactMessageEntity.IsRead)
        {
            contactMessageEntity.IsRead = true;
            _context.ContactMessages.Update(contactMessageEntity);
            await _context.SaveChangesAsync();
        }

        return MapToInfoDto(contactMessageEntity);
    }

    protected async Task<bool> ReplyToContactMessageActionAsync(int id, ContactMessageReplyDto data)
    {
        var contactMessageEntity = await _context.ContactMessages.FirstOrDefaultAsync(x => x.Id == id);
        if (contactMessageEntity == null || contactMessageEntity.IsDeleted)
            return false;

        contactMessageEntity.Reply = data.Reply;
        contactMessageEntity.ReplyDate = DateTime.UtcNow;
        contactMessageEntity.IsRead = true;

        try
        {
            _context.ContactMessages.Update(contactMessageEntity);
            await _context.SaveChangesAsync();

            await NotifyUserOfReplyAsync(contactMessageEntity.UserId);

            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private async Task NotifyUserOfReplyAsync(int userId)
    {
        _context.Add(new NotificationEntity
        {
            Type = NotificationType.Account,
            Message = "Ai primit un răspuns la mesajul tău trimis către FinSim.",
            UserId = userId
        });
        await _context.SaveChangesAsync();
    }

    protected async Task<bool> DeleteContactMessageActionAsync(int id)
    {
        var contactMessageEntity = await _context.ContactMessages.FirstOrDefaultAsync(x => x.Id == id);
        if (contactMessageEntity == null)
            return false;

        try
        {
            contactMessageEntity.IsDeleted = true;
            _context.ContactMessages.Update(contactMessageEntity);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private static ContactMessageInfoDto MapToInfoDto(ContactMessageEntity contactMessageEntity) => new()
    {
        Id = contactMessageEntity.Id,
        Name = contactMessageEntity.Name,
        Email = contactMessageEntity.Email,
        Message = contactMessageEntity.Message,
        UserId = contactMessageEntity.UserId,
        CreatedAt = contactMessageEntity.CreatedAt,
        IsRead = contactMessageEntity.IsRead,
        Reply = contactMessageEntity.Reply,
        ReplyDate = contactMessageEntity.ReplyDate,
        IsDeleted = contactMessageEntity.IsDeleted
    };
}
