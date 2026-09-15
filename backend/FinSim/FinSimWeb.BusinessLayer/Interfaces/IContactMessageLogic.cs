using FinSim.Domain.Models.Messages;
using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Interfaces;

public interface IContactMessageLogic
{
    Task<ActionResponse> CreateContactMessageAsync(int userId, ContactMessageCreateDto data);
    Task<ActionResponse> GetContactMessageListAsync();
    Task<ActionResponse> GetContactMessageByIdAsync(int id);
    Task<ActionResponse> ReplyToContactMessageAsync(int id, ContactMessageReplyDto data);
    Task<ActionResponse> DeleteContactMessageAsync(int id);
}
