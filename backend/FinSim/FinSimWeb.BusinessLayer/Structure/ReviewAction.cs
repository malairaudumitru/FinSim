using FinSim.DataAccessLayer.Context;
using FinSim.Domain.Entities.Reviews;
using FinSim.Domain.Models.Responses;
using FinSim.Domain.Models.Reviews;
using Microsoft.EntityFrameworkCore;

namespace FinSim.BusinessLayer.Structure;

public class ReviewAction
{
    protected readonly AppDbContext _context;

    public ReviewAction(AppDbContext context)
    {
        _context = context;
    }

    protected async Task<bool> CreateReviewActionAsync(ReviewCreateDto data)
    {
        var validate = ValidateReview(data);
        if (!validate.IsSuccess)
            return false;

        var reviewEntity = new ReviewEntity
        {
            Name = data.Name,
            Age = data.Age,
            Email = data.Email,
            Rating = data.Rating,
            Message = data.Message
        };

        try
        {
            _context.Add(reviewEntity);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    private ActionResponse ValidateReview(ReviewCreateDto data)
    {
        if (string.IsNullOrEmpty(data.Name))
            return new ActionResponse { IsSuccess = false, Message = "Name is empty" };
        if (string.IsNullOrEmpty(data.Email))
            return new ActionResponse { IsSuccess = false, Message = "Email is empty" };
        if (string.IsNullOrEmpty(data.Message))
            return new ActionResponse { IsSuccess = false, Message = "Message is empty" };

        return new ActionResponse { IsSuccess = true };
    }

    protected async Task<List<ReviewInfoDto>> GetReviewListActionAsync()
    {
        return await _context.Reviews
            .Where(x => x.IsDeleted == false)
            .OrderByDescending(x => x.CreatedAt)
            .Select(reviewEntity => MapToInfoDto(reviewEntity))
            .ToListAsync();
    }

    protected async Task<bool> UpdateReviewActionAsync(int id, ReviewCreateDto data)
    {
        var reviewEntity = await _context.Reviews.FirstOrDefaultAsync(x => x.Id == id);
        if (reviewEntity == null || reviewEntity.IsDeleted)
            return false;

        var validate = ValidateReview(data);
        if (!validate.IsSuccess)
            return false;

        reviewEntity.Name = data.Name;
        reviewEntity.Age = data.Age;
        reviewEntity.Email = data.Email;
        reviewEntity.Rating = data.Rating;
        reviewEntity.Message = data.Message;

        try
        {
            _context.Reviews.Update(reviewEntity);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    protected async Task<bool> DeleteReviewActionAsync(int id)
    {
        var reviewEntity = await _context.Reviews.FirstOrDefaultAsync(x => x.Id == id);
        if (reviewEntity == null)
            return false;

        try
        {
            reviewEntity.IsDeleted = true;
            _context.Reviews.Update(reviewEntity);
            await _context.SaveChangesAsync();
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
        Name = reviewEntity.Name,
        Age = reviewEntity.Age,
        Email = reviewEntity.Email,
        CreatedAt = reviewEntity.CreatedAt,
        Rating = reviewEntity.Rating,
        Message = reviewEntity.Message,
        IsDeleted = reviewEntity.IsDeleted
    };
}
