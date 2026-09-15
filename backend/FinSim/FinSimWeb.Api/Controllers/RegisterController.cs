using FinSim.BusinessLayer;
using FinSim.BusinessLayer.Interfaces;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinSim.Api.Controllers;

[ApiController]
[Route("api/register")]
[AllowAnonymous]
public class RegisterController : ControllerBase
{
    private readonly IAuthLogic _authLogic;

    public RegisterController(AppDbContext context)
    {
        var bl = new BusinessLogic();
        _authLogic = bl.GetAuthLogic(context);
    }

    [HttpPost]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto registerInfo)
    {
        var result = await _authLogic.RegisterAsync(registerInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
