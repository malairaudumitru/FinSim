using System.Security.Claims;
using FinSim.BusinessLayer;
using FinSim.BusinessLayer.Interfaces;
using FinSim.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinSim.Api.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserLogic _userLogic;

    public UserController()
    {
        var bl = new BusinessLogic();
        _userLogic = bl.GetUserLogic();
    }

    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private bool IsAdmin => User.IsInRole("Admin");

    [HttpPost("create")]
    [Authorize(Roles = "Admin")]
    public IActionResult CreateUser([FromBody] UserCreateDto userInfo)
    {
        var result = _userLogic.CreateUser(userInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpGet("list")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetUserList()
    {
        var result = _userLogic.GetUserList();
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpGet("{id}")]
    public IActionResult GetUserById([FromRoute] int id)
    {
        if (!IsAdmin && id != CurrentUserId)
            return Forbid();

        var result = _userLogic.GetUserById(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPut("update/{id}")]
    public IActionResult UpdateUser([FromRoute] int id, [FromBody] UserCreateDto userInfo)
    {
        if (!IsAdmin && id != CurrentUserId)
            return Forbid();

        var result = _userLogic.UpdateUser(id, userInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteUser([FromRoute] int id)
    {
        var result = _userLogic.DeleteUser(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin")]
    public IActionResult UpdateUserStatus([FromRoute] int id, [FromBody] UpdateUserStatusDto dto)
    {
        var result = _userLogic.UpdateUserStatus(id, dto.Status);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
