using Sabio.Models.Domain.Reviews;
using Sabio.Models.Requests.Reviews;
using System.Collections.Generic;

namespace Sabio.Services
{
    public interface IReviewService
    {
        int Add(int userId, ReviewAddRequest request);
        void Delete(int id);
        List<Review> Get(int id);
        void Update(int userId, ReviewUpdateRequest update);
    }
}