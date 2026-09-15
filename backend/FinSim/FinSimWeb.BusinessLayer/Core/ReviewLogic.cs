using FinSim.BusinessLayer.Interfaces;
using FinSim.BusinessLayer.Structure;
using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.Reviews;

namespace FinSim.BusinessLayer.Core;

public class ReviewLogic : ReviewAction, IReviewLogic
{
    public ReviewLogic(AppDbContext context) : base(context) { }

    public ActionResponse CreateReview(ReviewCreateDto data)
    {
        var result = CreateReviewAction(data);
        if (result == false)
            return ActionResponse.BadRequest("Error creating review");
        return ActionResponse.Ok("Review created successfully");
    }

    public ActionResponse GetReviewList()
    {
        var result = GetReviewListAction();
        return ActionResponse.Ok(data: result);
    }

    public ActionResponse UpdateReview(int id, ReviewCreateDto data)
    {
        var result = UpdateReviewAction(id, data);
        if (result == false)
            return ActionResponse.BadRequest("Error updating review");
        return ActionResponse.Ok("Review updated successfully");
    }

    public ActionResponse DeleteReview(int id)
    {
        var result = DeleteReviewAction(id);
        if (result == false)
            return ActionResponse.NotFound("Review not found");
        return ActionResponse.Ok("Review deleted successfully");
    }
}
