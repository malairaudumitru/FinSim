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
}