using Sabio.Models.Domain.SurveyInstances;
using Sabio.Models.Domain.Surveys;
using Sabio.Models.Requests.SurveyInstances;

namespace Sabio.Services.Interfaces
{
    public interface ISurveyInstanceService
    {
        int Add(int userId, SurveyInstanceAddRequest request);
        SurveyInstance Get(int id);
    }
}