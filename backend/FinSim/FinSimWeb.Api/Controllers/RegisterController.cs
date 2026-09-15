using FinSim.BusinessLayer;
using FinSim.BusinessLayer.Interfaces;
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

    public RegisterController()
    {
        var bl = new BusinessLogic();
        _authLogic = bl.GetAuthLogic();
    }

    [HttpPost]
    public IActionResult Register([FromBody] UserRegisterDto registerInfo)
    {
        var result = _authLogic.Register(registerInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
