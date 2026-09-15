using FinSim.Domain.Models.Messages;
using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Interfaces;

public interface IContactMessageLogic
{
    ActionResponse CreateContactMessage(int userId, ContactMessageCreateDto data);
    ActionResponse GetContactMessageList();
    ActionResponse GetContactMessageById(int id);
    ActionResponse ReplyToContactMessage(int id, ContactMessageReplyDto data);
    ActionResponse DeleteContactMessage(int id);
}
