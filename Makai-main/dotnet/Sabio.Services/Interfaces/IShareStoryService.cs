using Sabio.Models;
using Sabio.Models.Domain.ShareStory;
using Sabio.Models.Requests;
using Sabio.Models.Requests.ShareStory;


namespace Sabio.Services.Interfaces
{
    public interface IShareStoryService
    {
        int Add(ShareStoryAddRequest model, int userId);

        ShareStory Get(int id);

        Paged<ShareStory> GetAll(int pageIndex, int pageSize);

        void Update(ShareStoryUpdateRequest model, int userId);

        void UpdateApproval(int id, int userId);

        void Delete(int id);
    }
}
