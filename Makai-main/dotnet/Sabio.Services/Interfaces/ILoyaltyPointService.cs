using Sabio.Models;
using Sabio.Models.Domain.LoyaltyPoints;
using Sabio.Models.Requests.LoyaltyPoints;

namespace Sabio.Services.Interfaces
{
    public interface ILoyaltyPointService
    {
        int Add(LoyaltyPointAddRequest model, int userId);
        Paged<LoyaltyPoint> GetByUserId(int pageIndex, int pageSize, int userId);
        LoyaltyPointsTotal GetByUserId_RunningTotal(int userId);
    }
}