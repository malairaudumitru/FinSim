using System.Security.Claims;
using FinSim.BusinessLayer;
using FinSim.BusinessLayer.Interfaces;
using FinSim.DataAccessLayer.Context;
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

    public UserController(AppDbContext context)
    {
        var bl = new BusinessLogic();
        _userLogic = bl.GetUserLogic(context);
    }

    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private bool IsAdmin => User.IsInRole("Admin");

    [HttpPost("create")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateUser([FromBody] UserCreateDto userInfo)
    {
        var result = await _userLogic.CreateUserAsync(userInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpGet("list")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUserList()
    {
        var result = await _userLogic.GetUserListAsync();
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById([FromRoute] int id)
    {
        if (!IsAdmin && id != CurrentUserId)
            return Forbid();

        var result = await _userLogic.GetUserByIdAsync(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPut("update/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUser([FromRoute] int id, [FromBody] UserUpdateDto userInfo)
    {
        var result = await _userLogic.UpdateUserAsync(id, userInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpPut("me")]
    public async Task<IActionResult> UpdateMe([FromBody] UserSelfUpdateDto userInfo)
    {
        var result = await _userLogic.UpdateSelfAsync(CurrentUserId, userInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser([FromRoute] int id)
    {
        var result = await _userLogic.DeleteUserAsync(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUserStatus([FromRoute] int id, [FromBody] UpdateUserStatusDto dto)
    {
        var result = await _userLogic.UpdateUserStatusAsync(id, dto.Status);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
