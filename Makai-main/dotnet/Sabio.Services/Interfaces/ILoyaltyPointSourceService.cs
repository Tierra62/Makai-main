using Sabio.Models;
using Sabio.Models.Domain.LoyaltyPoints;
using Sabio.Models.Requests.LoyaltyPoints;
using System.Data;

namespace Sabio.Services.Interfaces
{
    public interface ILoyaltyPointSourceService
    {
        LoyaltyPointSource GetById(int id);
        Paged<LoyaltyPointSource> GetAll(int pageIndex, int pageSize);
        int Add(LoyaltyPointSourceAddRequest model, int userId);
        void Update(LoyaltyPointSourceUpdateRequest model, int userId);
        void UpdateIsDeleted(int id, int userId);
        void UpdateIsExpired(int id, int userId);
    }
}