using System.Security.Claims;
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

    public ContactMessageController(IContactMessageLogic contactMessageLogic)
    {
        _contactMessageLogic = contactMessageLogic;
    }

    [HttpPost("create")]
    [Authorize]
    public async Task<IActionResult> CreateContactMessage([FromBody] ContactMessageCreateDto messageInfo)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await _contactMessageLogic.CreateContactMessageAsync(userId, messageInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpGet("list")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetContactMessageList()
    {
        var result = await _contactMessageLogic.GetContactMessageListAsync();
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpGet("mine/{id}")]
    [Authorize]
    public async Task<IActionResult> GetOwnContactMessage([FromRoute] int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var result = await _contactMessageLogic.GetOwnContactMessageAsync(id, userId);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetContactMessageById([FromRoute] int id)
    {
        var result = await _contactMessageLogic.GetContactMessageByIdAsync(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPut("{id}/reply")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ReplyToContactMessage([FromRoute] int id, [FromBody] ContactMessageReplyDto replyInfo)
    {
        var result = await _contactMessageLogic.ReplyToContactMessageAsync(id, replyInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteContactMessage([FromRoute] int id)
    {
        var result = await _contactMessageLogic.DeleteContactMessageAsync(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
