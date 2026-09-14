using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.Reviews;

namespace FinSim.BusinessLayer.Interfaces;

public interface IReviewLogic
{
    ActionResponse CreateReview(ReviewCreateDto data);
    ActionResponse GetReviewList();
    ActionResponse UpdateReview(int id, ReviewCreateDto data);
    ActionResponse DeleteReview(int id);
}
