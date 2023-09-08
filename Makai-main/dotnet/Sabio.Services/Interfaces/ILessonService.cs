using Microsoft.AspNetCore.Mvc;
using Sabio.Models;
using Sabio.Models.Domain.Lessons;
using Sabio.Models.Requests.Lessons;
using Sabio.Models.Requests.Locations;
using Sabio.Web.Models.Responses;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface ILessonService
    {
        void Delete(int id);
        Paged<Lesson> GetAllPaginated(int pageIndex, int pageSize);

        Lesson GetById(int id);
        Paged<Lesson> GetBySiteIdPaginated(int pageSize, int pageIndex, int siteId);
        int Add(LessonAddRequest model, int userId);
        void Update(LessonUpdateRequest model, int userId);
    }
}