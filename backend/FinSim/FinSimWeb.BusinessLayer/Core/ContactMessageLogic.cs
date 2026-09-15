using FinSim.BusinessLayer.Interfaces;
using FinSim.BusinessLayer.Structure;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Models.Messages;
using FinSim.Domain.Models.Responses;

namespace FinSim.BusinessLayer.Core;

public class ContactMessageLogic : ContactMessageAction, IContactMessageLogic
{
    public ContactMessageLogic(AppDbContext context) : base(context) { }

    public ActionResponse CreateContactMessage(int userId, ContactMessageCreateDto data)
    {
        var result = CreateContactMessageAction(userId, data);
        if (result == false)
            return ActionResponse.BadRequest("Error creating contact message");
        return ActionResponse.Ok("Contact message created successfully");
    }

    public ActionResponse GetContactMessageList()
    {
        var result = GetContactMessageListAction();
        return ActionResponse.Ok(data: result);
    }

    public ActionResponse GetContactMessageById(int id)
    {
        var result = GetContactMessageByIdAction(id);
        if (result == null)
            return ActionResponse.NotFound("Contact message not found");
        return ActionResponse.Ok(data: result);
    }

    public ActionResponse ReplyToContactMessage(int id, ContactMessageReplyDto data)
    {
        var result = ReplyToContactMessageAction(id, data);
        if (result == false)
            return ActionResponse.BadRequest("Error replying to contact message");
        return ActionResponse.Ok("Reply sent successfully");
    }

    public ActionResponse DeleteContactMessage(int id)
    {
        var result = DeleteContactMessageAction(id);
        if (result == false)
            return ActionResponse.NotFound("Contact message not found");
        return ActionResponse.Ok("Contact message deleted successfully");
    }
}
