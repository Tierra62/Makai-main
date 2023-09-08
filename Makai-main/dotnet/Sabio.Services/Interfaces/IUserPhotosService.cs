using Sabio.Models;
using Sabio.Models.Domain.UserPhotos;
using Sabio.Models.Requests.UserPhotos;
using Sabio.Models.Requests.Users;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IUserPhotosService
    {
        void Delete(int id);
        List<UserPhotos> Get(int CreatedBy);
        int Add(UserPhotosAddRequest model, int UserId);
        void Update(UserPhotosUpdateRequest model, int UserId);
        void UpdateIsApproved(UserPhotosUpdateIsApprovedRequest model, int UserId);
        Paged<UserPhotos> GetByIsApproved(int pageIndex, int pageSize, bool isApproved);
        Paged<UserPhotos> GetByNotApproved(int pageIndex, int pageSize, bool isApproved);

    }
}