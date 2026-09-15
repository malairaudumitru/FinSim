using FinSim.BusinessLayer.Core;
using FinSim.BusinessLayer.Interfaces;

namespace FinSim.BusinessLayer;

public class BusinessLogic
{
    public IUserLogic GetUserLogic()
    {
        return new UserLogic();
    }

    public IScenarioLogic GetScenarioLogic()
    {
        return new ScenarioLogic();
    }

    public IScenarioHistoryLogic GetScenarioHistoryLogic()
    {
        return new ScenarioHistoryLogic();
    }

    public ILeaderboardLogic GetLeaderboardLogic()
    {
        return new LeaderboardLogic();
    }

    public IReviewLogic GetReviewLogic()
    {
        return new ReviewLogic();
    }

    public INotificationLogic GetNotificationLogic()
    {
        return new NotificationLogic();
    }

    public IResourceLogic GetResourceLogic()
    {
        return new ResourceLogic();
    }

    public IContactMessageLogic GetContactMessageLogic()
    {
        return new ContactMessageLogic();
    }

    public IAuthLogic GetAuthLogic()
    {
        return new AuthLogic();
    }
}