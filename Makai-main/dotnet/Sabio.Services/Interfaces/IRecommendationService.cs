using Sabio.Models;
using Sabio.Models.Domain.Recommendations;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Recommendations;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IRecommendationService
    {
        int Add(RecommendationAddRequest model, int userId);
        List<Recommendation> GetByPartnerId(int PartnerId);
        Paged<Recommendation> Pagination(int pageIndex, int pageSize);
        void UpdateIsActive(bool isActive, int id, int userId);
        void UpdateIsDeleted(bool isDeleted, int id, int userId);
    }
}