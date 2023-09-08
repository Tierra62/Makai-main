using Sabio.Models.Domain.ShareStory;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Sabio.Data.Providers;
using Sabio.Models.Domain.SurveyQuestions;
using Sabio.Data;
using Sabio.Models.Requests;
using Sabio.Models.Requests.SurveyQuestions;
using Sabio.Models;
using Sabio.Models.Requests.ShareStory;

namespace Sabio.Services
{
    public class SurveyQuestionService : ISurveyQuestionService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        ILookUpService _lookUpService = null;

        public SurveyQuestionService(IDataProvider data, IBaseUserMapper userMapper, ILookUpService lookUpService)
        {
            _data = data;
            _userMapper = userMapper;
            _lookUpService = lookUpService;
        }

        #region <---SurveyQuestion methods---|
        public int Add(SurveyQuestionAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[SurveyQuestions_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;              
                collection.AddWithValue("@UserId", userId);
                AddCommonParams(model, collection);
                collection.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object objId = returnCollection["@Id"].Value;

                int.TryParse(objId.ToString(), out id);
            });

            return id;
        }

        public SurveyQuestion Get(int id)
        {
            SurveyQuestion surveyQuestion = null;

            string procName = "[dbo].[SurveyQuestions_Select_ById]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                surveyQuestion = MapSingleQuestion(reader, ref startingIndex);
            }
            );

            return surveyQuestion;
        }

        public Paged<SurveyQuestion> GetAllUserQuestions(int pageIndex, int pageSize, int userId)
        {
            Paged<SurveyQuestion> pagedResult = null;
            List<SurveyQuestion> result = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                "[dbo].[SurveyQuestions_Select_ByCreatedBy]",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                    parameterCollection.AddWithValue("@UserId", userId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {

                    SurveyQuestion model = null;
                    int index = 0;
                    model = MapSingleQuestion(reader, ref index);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }


                    if (result == null)
                    {
                        result = new List<SurveyQuestion>();
                    }

                    result.Add(model);
                });

            if (result != null)
            {
                pagedResult = new Paged<SurveyQuestion>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public Paged<SurveyQuestion> GetAll(int pageIndex, int pageSize)
        {
            Paged<SurveyQuestion> pagedResult = null;
            List<SurveyQuestion> result = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                "[dbo].[SurveyQuestions_SelectAll]",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {

                    SurveyQuestion model = null;
                    int index = 0;
                    model = MapSingleQuestion(reader, ref index);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }


                    if (result == null)
                    {
                        result = new List<SurveyQuestion>();
                    }

                    result.Add(model);
                });

            if (result != null)
            {
                pagedResult = new Paged<SurveyQuestion>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public void Update(SurveyQuestionUpdateRequest model, int userId)
        {
            string procName = "[dbo].[SurveyQuestions_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@UserId", userId);
                AddCommonParams(model, parameterCollection);
                parameterCollection.AddWithValue("@Id", model.Id);
                
            },
            returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[SurveyQuestions_Delete_ById]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", id);

            }, returnParameters: null);
        }
        #endregion

        #region <---SurveyQuestionAnswerOption methods---|
        public int AddAnswer(SurveyQuestionAnswerAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[SurveyQuestionAnswerOptions_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                collection.AddWithValue("@CreatedBy", userId);
                AnswerCommonParams(model, collection);
                collection.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object objId = returnCollection["@Id"].Value;

                int.TryParse(objId.ToString(), out id);
            });

            return id;
        }

        public SurveyQuestionAnswerOptions GetAnswer(int id)
        {
            SurveyQuestionAnswerOptions answer = null;

            string procName = "[dbo].[SurveyQuestionAnswerOptions_Select_ById]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                answer = MapSingleAnswer(reader, ref startingIndex);
            }
            );

            return answer;
        }

        public Paged<SurveyQuestionAnswerOptions> GetAllUserAnswers(int pageIndex, int pageSize, int userId)
        {
            Paged<SurveyQuestionAnswerOptions> pagedResult = null;
            List<SurveyQuestionAnswerOptions> result = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                "[dbo].[SurveyQuestionAnswerOptions_Select_ByCreatedBy]",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                    parameterCollection.AddWithValue("@CreatedBy", userId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {

                    SurveyQuestionAnswerOptions model = null;
                    int index = 0;
                    model = MapSingleAnswer(reader, ref index);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }


                    if (result == null)
                    {
                        result = new List<SurveyQuestionAnswerOptions>();
                    }

                    result.Add(model);
                });

            if (result != null)
            {
                pagedResult = new Paged<SurveyQuestionAnswerOptions>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public Paged<SurveyQuestionAnswerOptions> GetAllAnswers(int pageIndex, int pageSize)
        {
            Paged<SurveyQuestionAnswerOptions> pagedResult = null;
            List<SurveyQuestionAnswerOptions> result = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                "[dbo].[SurveyQuestionAnswerOptions_SelectAll]",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {

                    SurveyQuestionAnswerOptions model = null;
                    int index = 0;
                    model = MapSingleAnswer(reader, ref index);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }


                    if (result == null)
                    {
                        result = new List<SurveyQuestionAnswerOptions>();
                    }

                    result.Add(model);
                });

            if (result != null)
            {
                pagedResult = new Paged<SurveyQuestionAnswerOptions>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public void UpdateAnswer(SurveyQuestionAnswerUpdateRequest model, int userId)
        {
            string procName = "[dbo].[SurveyQuestionAnswerOptions_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Createdby", userId);
                AnswerCommonParams(model, parameterCollection);
                parameterCollection.AddWithValue("@Id", model.Id);

            },
            returnParameters: null);
        }

        public void DeleteAnswer(int id)
        {
            string procName = "[dbo].[SurveyQuestionAnswerOptions_Delete_ById]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", id);

            }, returnParameters: null);
        }
        #endregion

        private static void AddCommonParams(SurveyQuestionAddRequest model, SqlParameterCollection paramCollection)
        {
            paramCollection.AddWithValue("@Question", model.Question);
            paramCollection.AddWithValue("@HelpText", model.HelpText);
            paramCollection.AddWithValue("@IsRequired", model.IsRequired);
            paramCollection.AddWithValue("@IsMultipleAllowed", model.IsMultipleAllowed);
            paramCollection.AddWithValue("@QuestionTypeId", model.QuestionTypeId);
            paramCollection.AddWithValue("@SurveyId", model.SurveyId);
            paramCollection.AddWithValue("@StatusId", model.StatusId);
            paramCollection.AddWithValue("@SortOrder", model.SortOrder);
        }
        private static void AnswerCommonParams(SurveyQuestionAnswerAddRequest model, SqlParameterCollection paramCollection)
        {
            paramCollection.AddWithValue("@QuestionId", model.QuestionId);
            paramCollection.AddWithValue("@Text", model.Text);
            paramCollection.AddWithValue("@Value", model.Value);
            paramCollection.AddWithValue("@AdditionalInfo", model.AdditionalInfo);
        }
        public SurveyQuestion MapSingleQuestion(IDataReader reader, ref int startingIndex)
        {
            SurveyQuestion model = new SurveyQuestion();

            model.Id = reader.GetSafeInt32(startingIndex++);
            model.User = _userMapper.MapUser(reader, ref startingIndex);
            model.Question = reader.GetSafeString(startingIndex++);
            model.HelpText = reader.GetSafeString(startingIndex++);
            model.IsRequired = reader.GetSafeBool(startingIndex++);
            model.IsMultipleAllowed = reader.GetSafeBool(startingIndex++);
            model.QuestionType = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            model.SurveyId = reader.GetSafeInt32(startingIndex++);
            model.Status = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            model.SortOrder = reader.GetSafeInt32(startingIndex++);
            model.DateCreated = reader.GetSafeDateTime(startingIndex++);
            model.DateModified = reader.GetSafeDateTime(startingIndex++);

            return model;
        }
        public SurveyQuestionAnswerOptions MapSingleAnswer(IDataReader reader, ref int startingIndex)
        {
            SurveyQuestionAnswerOptions model = new SurveyQuestionAnswerOptions();

            model.Id = reader.GetSafeInt32(startingIndex++);           
            model.QuestionId = reader.GetSafeInt32(startingIndex++);
            model.Text = reader.GetSafeString(startingIndex++);
            model.Value = reader.GetSafeString(startingIndex++);
            model.AdditionalInfo = reader.GetSafeString(startingIndex++);
            model.CreatedBy = _userMapper.MapUser(reader, ref startingIndex);
            model.DateCreated = reader.GetSafeDateTime(startingIndex++);
            model.DateModified = reader.GetSafeDateTime(startingIndex++);

            return model;
        }
    }
}
