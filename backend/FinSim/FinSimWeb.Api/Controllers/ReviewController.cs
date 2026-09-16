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

    public ReviewController(IReviewLogic reviewLogic)
    {
        _reviewLogic = reviewLogic;
    }

    [HttpPost("create")]
    [Authorize]
    public async Task<IActionResult> CreateReview([FromBody] ReviewCreateDto reviewInfo)
    {
        var result = await _reviewLogic.CreateReviewAsync(reviewInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpGet("list")]
    public async Task<IActionResult> GetReviewList()
    {
        var result = await _reviewLogic.GetReviewListAsync();
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [HttpPut("update/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateReview([FromRoute] int id, [FromBody] ReviewCreateDto reviewInfo)
    {
        var result = await _reviewLogic.UpdateReviewAsync(id, reviewInfo);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteReview([FromRoute] int id)
    {
        var result = await _reviewLogic.DeleteReviewAsync(id);
        if (result.IsSuccess == false)
            return StatusCode((int)result.StatusCode, result.Message);

        return Ok(result.Message);
    }
}
