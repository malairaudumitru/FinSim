using FinSim.BusinessLayer.Core;
using FinSim.BusinessLayer.Interfaces;

namespace FinSim.BusinessLayer;

public class BusinessLogic
{
    public IUserLogic GetUserLogic()
    {
        return new UserLogic();
    }
}