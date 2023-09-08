using Sabio.Models;
using Sabio.Models.Domain.SurveyQuestions;
using Sabio.Models.Requests.SurveyQuestions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface ISurveyQuestionService
    {
        #region  <---Questions---|
        int Add(SurveyQuestionAddRequest model, int userId);

        SurveyQuestion Get(int id);

        Paged<SurveyQuestion> GetAllUserQuestions(int pageIndex, int pageSize, int userId);

        Paged<SurveyQuestion> GetAll(int pageIndex, int pageSize);

        void Update(SurveyQuestionUpdateRequest model, int userId);

        void Delete(int id);
        #endregion

        #region <---Answers---|
        int AddAnswer(SurveyQuestionAnswerAddRequest model, int userId);

        SurveyQuestionAnswerOptions GetAnswer(int id);

        Paged<SurveyQuestionAnswerOptions> GetAllUserAnswers(int pageIndex, int pageSize, int userId);

        Paged<SurveyQuestionAnswerOptions> GetAllAnswers(int pageIndex, int pageSize);

        void UpdateAnswer(SurveyQuestionAnswerUpdateRequest model, int userId);

        void DeleteAnswer(int id);
        #endregion
    }
}
