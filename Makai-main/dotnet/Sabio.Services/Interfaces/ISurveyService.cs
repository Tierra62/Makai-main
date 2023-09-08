using Sabio.Models;
using Sabio.Models.Domain.SurveyDetails;
using Sabio.Models.Domain.Surveys;
using Sabio.Models.Requests.Surveys;

namespace Sabio.Services.Interfaces
{
    public interface ISurveyService
    {
        int Add(int userId, SurveyAddRequest request);
        void Delete(int id);
        Survey Get(int id);
        SurveyDetail GetDetails(int id);
        Paged<Survey> GetAll(int pageIndex, int pageSize);
        Paged<Survey> GetCreatedBy(int pageIndex, int pageSize, int id);
        void Update(int userId, SurveyUpdateRequest update);
        Paged<SearchSurvey> SearchPaginated(int pageIndex, int pageSize, string query);
    }
}