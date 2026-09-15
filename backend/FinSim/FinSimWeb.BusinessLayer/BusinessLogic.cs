using FinSim.BusinessLayer.Core;
using FinSim.BusinessLayer.Interfaces;
using FinSim.DataAccessLayer.Context;

namespace FinSim.BusinessLayer;

public class BusinessLogic
{
    public IUserLogic GetUserLogic(AppDbContext context)
    {
        return new UserLogic(context);
    }

    public IScenarioLogic GetScenarioLogic(AppDbContext context)
    {
        return new ScenarioLogic(context);
    }

    public IScenarioHistoryLogic GetScenarioHistoryLogic(AppDbContext context)
    {
        return new ScenarioHistoryLogic(context);
    }

    public ILeaderboardLogic GetLeaderboardLogic(AppDbContext context)
    {
        return new LeaderboardLogic(context);
    }

    public IReviewLogic GetReviewLogic(AppDbContext context)
    {
        return new ReviewLogic(context);
    }

    public INotificationLogic GetNotificationLogic(AppDbContext context)
    {
        return new NotificationLogic(context);
    }

    public IResourceLogic GetResourceLogic(AppDbContext context)
    {
        return new ResourceLogic(context);
    }

    public IContactMessageLogic GetContactMessageLogic(AppDbContext context)
    {
        return new ContactMessageLogic(context);
    }

    public IAuthLogic GetAuthLogic(AppDbContext context)
    {
        return new AuthLogic(context);
    }
}
