using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Messages;
using FinSim.Domain.Entities.Notifications;
using FinSim.Domain.Models.Messages;

namespace FinSim.BusinessLayer.Structure;

public class ContactMessageAction
{
    protected readonly AppDbContext _context;

    public ContactMessageAction(AppDbContext context)
    {
        _context = context;
    }

    protected bool CreateContactMessageAction(int userId, ContactMessageCreateDto data)
    {
        var user = _context.Users.FirstOrDefault(u => u.Id == userId && u.IsDeleted == false);
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
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected List<ContactMessageInfoDto> GetContactMessageListAction()
    {
        return _context.ContactMessages
            .Where(x => x.IsDeleted == false)
            .OrderByDescending(x => x.CreatedAt)
            .Select(contactMessageEntity => MapToInfoDto(contactMessageEntity))
            .ToList();
    }

    protected ContactMessageInfoDto? GetContactMessageByIdAction(int id)
    {
        var contactMessageEntity = _context.ContactMessages
            .FirstOrDefault(x => x.Id == id && x.IsDeleted == false);
        if (contactMessageEntity == null)
            return null;

        if (!contactMessageEntity.IsRead)
        {
            contactMessageEntity.IsRead = true;
            _context.ContactMessages.Update(contactMessageEntity);
            _context.SaveChanges();
        }

        return MapToInfoDto(contactMessageEntity);
    }

    protected bool ReplyToContactMessageAction(int id, ContactMessageReplyDto data)
    {
        var contactMessageEntity = _context.ContactMessages.Find(id);
        if (contactMessageEntity == null || contactMessageEntity.IsDeleted)
            return false;

        contactMessageEntity.Reply = data.Reply;
        contactMessageEntity.ReplyDate = DateTime.UtcNow;
        contactMessageEntity.IsRead = true;

        try
        {
            _context.ContactMessages.Update(contactMessageEntity);
            _context.SaveChanges();

            NotifyUserOfReply(contactMessageEntity.UserId);

            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private void NotifyUserOfReply(int userId)
    {
        _context.Add(new NotificationEntity
        {
            Type = NotificationType.Account,
            Message = "Ai primit un răspuns la mesajul tău trimis către FinSim.",
            UserId = userId
        });
        _context.SaveChanges();
    }

    protected bool DeleteContactMessageAction(int id)
    {
        var contactMessageEntity = _context.ContactMessages.Find(id);
        if (contactMessageEntity == null)
            return false;

        try
        {
            contactMessageEntity.IsDeleted = true;
            _context.ContactMessages.Update(contactMessageEntity);
            _context.SaveChanges();
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
