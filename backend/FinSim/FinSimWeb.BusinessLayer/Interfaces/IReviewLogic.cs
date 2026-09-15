using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.Reviews;

namespace FinSim.BusinessLayer.Interfaces;

public interface IReviewLogic
{
    Task<ActionResponse> CreateReviewAsync(ReviewCreateDto data);
    Task<ActionResponse> GetReviewListAsync();
    Task<ActionResponse> UpdateReviewAsync(int id, ReviewCreateDto data);
    Task<ActionResponse> DeleteReviewAsync(int id);
}
