using FinSim.BusinessLayer.Interfaces;
using FinSim.BusinessLayer.Structure;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Models.Messages;
using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Core;

public class ContactMessageLogic : ContactMessageAction, IContactMessageLogic
{
    public ContactMessageLogic(AppDbContext context) : base(context) { }

    public async Task<ActionResponse> CreateContactMessageAsync(int userId, ContactMessageCreateDto data)
    {
        var result = await CreateContactMessageActionAsync(userId, data);
        if (result == false)
            return ActionResponse.BadRequest("Error creating contact message");
        return ActionResponse.Ok("Contact message created successfully");
    }

    public async Task<ActionResponse> GetContactMessageListAsync()
    {
        var result = await GetContactMessageListActionAsync();
        return ActionResponse.Ok(data: result);
    }

    public async Task<ActionResponse> GetContactMessageByIdAsync(int id)
    {
        var result = await GetContactMessageByIdActionAsync(id);
        if (result == null)
            return ActionResponse.NotFound("Contact message not found");
        return ActionResponse.Ok(data: result);
    }

    public async Task<ActionResponse> ReplyToContactMessageAsync(int id, ContactMessageReplyDto data)
    {
        var result = await ReplyToContactMessageActionAsync(id, data);
        if (result == false)
            return ActionResponse.BadRequest("Error replying to contact message");
        return ActionResponse.Ok("Reply sent successfully");
    }

    public async Task<ActionResponse> DeleteContactMessageAsync(int id)
    {
        var result = await DeleteContactMessageActionAsync(id);
        if (result == false)
            return ActionResponse.NotFound("Contact message not found");
        return ActionResponse.Ok("Contact message deleted successfully");
    }
}
