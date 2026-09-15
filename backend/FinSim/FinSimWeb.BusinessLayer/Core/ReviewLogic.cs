using FinSim.BusinessLayer.Interfaces;
using FinSim.BusinessLayer.Structure;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.Reviews;

namespace FinSim.BusinessLayer.Core;

public class ReviewLogic : ReviewAction, IReviewLogic
{
    public ReviewLogic(AppDbContext context) : base(context) { }

    public async Task<ActionResponse> CreateReviewAsync(ReviewCreateDto data)
    {
        var result = await CreateReviewActionAsync(data);
        if (result == false)
            return ActionResponse.BadRequest("Error creating review");
        return ActionResponse.Ok("Review created successfully");
    }

    public async Task<ActionResponse> GetReviewListAsync()
    {
        var result = await GetReviewListActionAsync();
        return ActionResponse.Ok(data: result);
    }

    public async Task<ActionResponse> UpdateReviewAsync(int id, ReviewCreateDto data)
    {
        var result = await UpdateReviewActionAsync(id, data);
        if (result == false)
            return ActionResponse.BadRequest("Error updating review");
        return ActionResponse.Ok("Review updated successfully");
    }

    public async Task<ActionResponse> DeleteReviewAsync(int id)
    {
        var result = await DeleteReviewActionAsync(id);
        if (result == false)
            return ActionResponse.NotFound("Review not found");
        return ActionResponse.Ok("Review deleted successfully");
    }
}
