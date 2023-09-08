using Sabio.Models;
using Sabio.Models.Domain.SiteTrainings;
using Sabio.Models.Requests.SiteTrainings;
using System;

namespace Sabio.Services.Interfaces
{
    public interface ISiteTrainingService
    {
        int Add(SiteTrainingsAddRequest model, int userId);
        void Delete(int id);
        Paged<SiteTraining> Search(int pageIndex, int pageSize, string query, bool isDeleted);
        Paged<SiteTraining> SelectAll(int pageIndex, int pageSize, bool isDeleted);
        Paged<SiteTraining> SelectByCategoryId(int pageIndex, int pageSize, int categoryId, bool isDeleted);
        Paged<SiteTraining> SelectByCreatedBy(int pageIndex, int pageSize, int userId, bool isDeleted);
        SiteTraining SelectById(int id);
        void Update(SiteTrainingsUpdateRequest model, int userId);
    }
}