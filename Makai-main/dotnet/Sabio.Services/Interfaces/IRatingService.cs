using Sabio.Models;
using Sabio.Models.Domain.Ratings;
using Sabio.Models.Requests.Ratings;

namespace Sabio.Services.Interfaces
{
    public interface IRatingService
    {
        int Add(RatingAddRequest model, int userId);
        void Delete(int id);
        EntityRating GetAverage(int entityTypeId, int entityId);
        Paged<Ratings> GetByEntityId(int entityTypeId, int entityId, int pageIndex, int pageSize);
        void Update(RatingUpdateRequest model, int userId);
    }
}