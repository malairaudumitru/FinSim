using System.Security.Claims;
using FinSim.BusinessLayer;
using FinSim.BusinessLayer.Interfaces;
using FinSim.Domain.Models.Messages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinSim.Api.Controllers;

[ApiController]
[Route("api/messages")]
public class ContactMessageController : ControllerBase
{
    private readonly IContactMessageLogic _contactMessageLogic;

    public ContactMessageController()
    {
        var bl = new BusinessLogic();
        _contactMessageLogic = bl.GetContactMessageLogic();
    }

    [HttpPost("create")]
    [Authorize]
    public IActionResult CreateContactMessage([FromBody] ContactMessageCreateDto messageInfo)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = _contactMessageLogic.CreateContactMessage(userId, messageInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpGet("list")]
    public IActionResult GetContactMessageList()
    {
        var result = _contactMessageLogic.GetContactMessageList();
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpGet("{id}")]
    public IActionResult GetContactMessageById([FromRoute] int id)
    {
        var result = _contactMessageLogic.GetContactMessageById(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPut("{id}/reply")]
    public IActionResult ReplyToContactMessage([FromRoute] int id, [FromBody] ContactMessageReplyDto replyInfo)
    {
        var result = _contactMessageLogic.ReplyToContactMessage(id, replyInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteContactMessage([FromRoute] int id)
    {
        var result = _contactMessageLogic.DeleteContactMessage(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
