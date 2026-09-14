using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Messages;
using FinSim.Domain.Models.Messages;

namespace FinSim.BusinessLayer.Structure;

public class ContactMessageAction
{
    private readonly ContactMessageDbContext _context = new();

    protected bool CreateContactMessageAction(ContactMessageCreateDto data)
    {
        var contactMessageEntity = new ContactMessageEntity
        {
            Nume = data.Nume,
            Email = data.Email,
            Mesaj = data.Mesaj
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

        if (!contactMessageEntity.Citit)
        {
            contactMessageEntity.Citit = true;
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

        contactMessageEntity.Raspuns = data.Raspuns;
        contactMessageEntity.RaspunsData = DateTime.UtcNow;
        contactMessageEntity.Citit = true;

        try
        {
            _context.ContactMessages.Update(contactMessageEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
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
        Nume = contactMessageEntity.Nume,
        Email = contactMessageEntity.Email,
        Mesaj = contactMessageEntity.Mesaj,
        CreatedAt = contactMessageEntity.CreatedAt,
        Citit = contactMessageEntity.Citit,
        Raspuns = contactMessageEntity.Raspuns,
        RaspunsData = contactMessageEntity.RaspunsData,
        IsDeleted = contactMessageEntity.IsDeleted
    };
}
