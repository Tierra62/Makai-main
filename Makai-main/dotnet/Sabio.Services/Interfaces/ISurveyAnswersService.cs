using Sabio.Models;
using Sabio.Models.Domain.SurveyAnswers;
using Sabio.Models.Domain.Surveys;
using Sabio.Models.Requests.SurveyAnswers;
using Sabio.Models.Requests.SurveyInstances;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface ISurveyAnswersService
    {
        int Add(List<SurveyAnswerAddRequest> models);
        SurveyAnswer GetById(int id);
        void Update(SurveyAnswerUpdateRequest model);
        void DeleteById(int id);
        Paged<SurveyAnswer> GetAllPaginated(int pageIndex, int pageSize);
        Paged<SurveyAnswer> GetByCreatedBy(int pageIndex, int pageSize, int createdBy);
        List<SurveyAnswer> GetByInstanceId(int instanceId);
        Paged<SurveyAnswer> GetBySurveyId(int pageIndex, int pageSize, int surveyId);

    }
}