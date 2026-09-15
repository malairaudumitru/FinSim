using FinSim.BusinessLayer;
using FinSim.BusinessLayer.Interfaces;
using FinSim.Domain.Models.Reviews;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinSim.Api.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewController : ControllerBase
{
    private readonly IReviewLogic _reviewLogic;

    public ReviewController()
    {
        var bl = new BusinessLogic();
        _reviewLogic = bl.GetReviewLogic();
    }

    [HttpPost("create")]
    [Authorize]
    public IActionResult CreateReview([FromBody] ReviewCreateDto reviewInfo)
    {
        var result = _reviewLogic.CreateReview(reviewInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpGet("list")]
    public IActionResult GetReviewList()
    {
        var result = _reviewLogic.GetReviewList();
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPut("update/{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult UpdateReview([FromRoute] int id, [FromBody] ReviewCreateDto reviewInfo)
    {
        var result = _reviewLogic.UpdateReview(id, reviewInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteReview([FromRoute] int id)
    {
        var result = _reviewLogic.DeleteReview(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
