using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Reviews;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.Reviews;

namespace FinSim.BusinessLayer.Structure;

public class ReviewAction
{
    private readonly ReviewDbContext _context = new();

    protected bool CreateReviewAction(ReviewCreateDto data)
    {
        var validate = ValidateReview(data);
        if (!validate.IsSuccess)
            return false;

        var reviewEntity = new ReviewEntity
        {
            Nume = data.Nume,
            Varsta = data.Varsta,
            Email = data.Email,
            Rating = data.Rating,
            Mesaj = data.Mesaj
        };

        try
        {
            _context.Add(reviewEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private ActionResponse ValidateReview(ReviewCreateDto data)
    {
        if (string.IsNullOrEmpty(data.Nume))
            return new ActionResponse { IsSuccess = false, Message = "Nume is empty" };
        if (string.IsNullOrEmpty(data.Email))
            return new ActionResponse { IsSuccess = false, Message = "Email is empty" };
        if (string.IsNullOrEmpty(data.Mesaj))
            return new ActionResponse { IsSuccess = false, Message = "Mesaj is empty" };

        return new ActionResponse { IsSuccess = true };
    }

    protected List<ReviewInfoDto> GetReviewListAction()
    {
        return _context.Reviews
            .Where(x => x.IsDeleted == false)
            .OrderByDescending(x => x.CreatedAt)
            .Select(reviewEntity => MapToInfoDto(reviewEntity))
            .ToList();
    }

    protected bool UpdateReviewAction(int id, ReviewCreateDto data)
    {
        var reviewEntity = _context.Reviews.Find(id);
        if (reviewEntity == null || reviewEntity.IsDeleted)
            return false;

        var validate = ValidateReview(data);
        if (!validate.IsSuccess)
            return false;

        reviewEntity.Nume = data.Nume;
        reviewEntity.Varsta = data.Varsta;
        reviewEntity.Email = data.Email;
        reviewEntity.Rating = data.Rating;
        reviewEntity.Mesaj = data.Mesaj;

        try
        {
            _context.Reviews.Update(reviewEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected bool DeleteReviewAction(int id)
    {
        var reviewEntity = _context.Reviews.Find(id);
        if (reviewEntity == null)
            return false;

        try
        {
            reviewEntity.IsDeleted = true;
            _context.Reviews.Update(reviewEntity);
            _context.SaveChanges();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private static ReviewInfoDto MapToInfoDto(ReviewEntity reviewEntity) => new()
    {
        Id = reviewEntity.Id,
        Nume = reviewEntity.Nume,
        Varsta = reviewEntity.Varsta,
        Email = reviewEntity.Email,
        CreatedAt = reviewEntity.CreatedAt,
        Rating = reviewEntity.Rating,
        Mesaj = reviewEntity.Mesaj,
        IsDeleted = reviewEntity.IsDeleted
    };
}
