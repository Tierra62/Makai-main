using Sabio.Models;
using Sabio.Models.Domain.Podcasts;
using Sabio.Models.Requests.Podcasts;

namespace Sabio.Services.Interfaces
{
    public interface IPodcastService
    {
        int Add(PodcastAddRequest model, int userId);
        void Update(PodcastUpdateRequest model, int userId);
        Paged<Podcast> Pagination(int page, int pageSize);
        Paged<Podcast> SearchPagination(int page, int pageSize, string query);
        void Delete(int id);
       
    }
}