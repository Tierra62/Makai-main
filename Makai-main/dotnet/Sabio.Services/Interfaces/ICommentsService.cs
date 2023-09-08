using Sabio.Models.Domain;
using Sabio.Models.Requests.Comments;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface ICommentsService
    {
        int Add(CommentsAddRequest model, int userId); 
        List<Comment> GetByEntityIdEntityType(int entityId, int entityTypeId); 
        void Update(CommentsUpdateRequest model, int userId);

        Dictionary<int, List<Comment>>GetReplies(List<Comment> comments);

        void Delete(int id);
    }
}