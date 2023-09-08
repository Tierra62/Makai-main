using Sabio.Data.Providers;
using Sabio.Models.Requests.SurveyAnswers;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Domain.SurveyAnswers;
using Sabio.Data;
using Sabio.Models;
using Sabio.Services.Interfaces;
using Stripe;
using Sabio.Models.Domain.Surveys;
using Sabio.Models.Domain.Orders;
using Sabio.Models.Domain.Reservations;
using Sabio.Models.Requests.SurveyInstances;

namespace Sabio.Services
{
    public class SurveyAnswersService : ISurveyAnswersService
    {
        IDataProvider _data = null;
        IAuthenticationService<int> _authService = null;
        IBaseUserMapper _userMapper = null;
        public SurveyAnswersService(IAuthenticationService<int> authService
            , IDataProvider data
            , IBaseUserMapper userMapper)
        {
            _data = data;
            _authService = authService;
            _userMapper = userMapper;
        }

        public int Add(List<SurveyAnswerAddRequest> models)
        {
            int id = 0;
            string procName = "[dbo].[SurveyAnswers_Insert]";
            DataTable dt = MapAnswersToTable(models);

        if (dt != null)
            {
                _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@SurveyAnswersInput", dt);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;
                    col.Add(idOut);
                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;
                    int.TryParse(oId.ToString(), out id);
                });
                        
            }
            return id;
        }
        public SurveyAnswer GetById(int id)
        {
            SurveyAnswer surveyAnswer = null;
            int startingIndex = 0;

            string procName = "[dbo].[SurveyAnswers_Select_ById]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                surveyAnswer = MapSingleSurveyAnswer(reader, ref startingIndex);
            });

            return surveyAnswer;
        }

        public void Update(SurveyAnswerUpdateRequest model)
        {
            string procName = "[dbo].[SurveyAnswers_Update]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection col)

            {
                col.AddWithValue("@Id", model.Id);
                AddCommonParams(model, col);

            }, null);
        }

        public void DeleteById(int id)
        {
            string procName = "[dbo].[SurveyAnswers_DeleteBy_Id]";
            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, null);
        }

        public Paged<SurveyAnswer> GetAllPaginated(int pageIndex, int pageSize)
        {
            Paged<SurveyAnswer> pagedResult = null;

            List<SurveyAnswer> result = null;

            int totalCount = 0;


            string procName = "dbo.SurveyAnswers_SelectAll";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
            },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;

                    SurveyAnswer surveyAnswer = new SurveyAnswer();

                    surveyAnswer = MapSingleSurveyAnswer(reader, ref startingIndex);


                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (result == null)
                    {
                        result = new List<SurveyAnswer>();
                    }

                    result.Add(surveyAnswer);
                }
            );

            if (result != null)
            {
                pagedResult = new Paged<SurveyAnswer>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public Paged<SurveyAnswer> GetByCreatedBy(int pageIndex, int pageSize, int userId)
        {
            Paged<SurveyAnswer> pagedResult = null;
            List<SurveyAnswer> result = null;
            int totalCount = 0;

            string procName = "dbo.SurveyAnswers_Select_ByCreatedBy";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@CreatedBy", userId);
            },
            
            (IDataReader reader, short set) =>
               {

                   int startingIndex = 0;
                   SurveyAnswer surveyAnswer = new SurveyAnswer();

                   surveyAnswer = MapSingleSurveyAnswer(reader, ref startingIndex);


                   if (totalCount == 0)
                   {
                       totalCount = reader.GetSafeInt32(startingIndex++);
                   }

                   if (result == null)
                   {
                       result = new List<SurveyAnswer>();
                   }

                   result.Add(surveyAnswer);
               }
           );

            if (result != null)
            {
                pagedResult = new Paged<SurveyAnswer>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public List<SurveyAnswer> GetByInstanceId(int instanceId)
        {
            List<SurveyAnswer> list = new List<SurveyAnswer>();

            string procName = "[dbo].[SurveyAnswers_Select_BySurveyInstanceId]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@InstanceId", instanceId);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                SurveyAnswer surveyAnswer = new SurveyAnswer();

                surveyAnswer = MapSingleSurveyAnswer(reader, ref startingIndex);


                list.Add(surveyAnswer);
            });

            return list;
        }

        public Paged<SurveyAnswer> GetBySurveyId(int pageIndex, int pageSize, int surveyId)
        {
            Paged<SurveyAnswer> pagedResult = null;
            List<SurveyAnswer> result = null;

            int totalCount = 0;

            string procName = "dbo.SurveyAnswers_Select_BySurveyId";


            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@SurveyId", surveyId);
                    paramCollection.AddWithValue("@PageSize", pageSize);
                    paramCollection.AddWithValue("@PageIndex", pageIndex);
                },
                 delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;

                    SurveyAnswer surveyAnswer = new SurveyAnswer();

                    surveyAnswer = MapSingleSurveyAnswer(reader, ref startingIndex);


                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (result == null)
                    {
                        result = new List<SurveyAnswer>();
                    }

                    result.Add(surveyAnswer);
                });

            if (result != null)
            {
                pagedResult = new Paged<SurveyAnswer>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        private SurveyAnswer MapSingleSurveyAnswer(IDataReader reader, ref int startingIndex)
        {
            SurveyAnswer surveyAnswer = new SurveyAnswer();

            surveyAnswer.UserId = reader.GetSafeInt32(startingIndex++);
            surveyAnswer.Id = reader.GetSafeInt32(startingIndex++);
            surveyAnswer.InstanceId = reader.GetSafeInt32(startingIndex++);
            surveyAnswer.SurveyId = reader.GetSafeInt32(startingIndex++);
            surveyAnswer.QuestionId = reader.GetSafeInt32(startingIndex++);
            surveyAnswer.AnswerOptionId = reader.GetSafeInt32(startingIndex++);
            surveyAnswer.Answer = reader.GetSafeString(startingIndex++);
            surveyAnswer.AnswerNumber = reader.GetSafeInt32(startingIndex++);
            surveyAnswer.DateCreated = reader.GetSafeDateTime(startingIndex++);
            surveyAnswer.DateModified = reader.GetSafeDateTime(startingIndex++);

            return surveyAnswer;
        }
        private static void AddCommonParams(SurveyAnswerAddRequest model, SqlParameterCollection dt)
        {
            
            dt.AddWithValue("@InstanceId", model.InstanceId);
            dt.AddWithValue("@QuestionId", model.QuestionId);
            dt.AddWithValue("@AnswerOptionId", model.AnswerOptionId);
            dt.AddWithValue("@Answer", model.Answer);
            dt.AddWithValue("@AnswerNumber", model.AnswerNumber);
        }

        private DataTable MapAnswersToTable(List<SurveyAnswerAddRequest> answersToMap)
        {
            DataTable dt = new DataTable();

            if (answersToMap != null)
            {
                dt.Columns.Add(new DataColumn("InstanceId", typeof(int)));
                dt.Columns.Add(new DataColumn("QuestionId", typeof(int)));
                dt.Columns.Add(new DataColumn("AnswerOptionId", typeof(int)));
                dt.Columns.Add(new DataColumn("Answer", typeof(string)));
                dt.Columns.Add(new DataColumn("AnswerNumber", typeof(int)));

                foreach (SurveyAnswerAddRequest singleAnswer in answersToMap)
                {
                    DataRow dr = dt.NewRow();
                    int startingIndex = 0;

                    dr.SetField(startingIndex++, singleAnswer.InstanceId);
                    dr.SetField(startingIndex++, singleAnswer.QuestionId);
                    dr.SetField(startingIndex++, singleAnswer.AnswerOptionId);
                    dr.SetField(startingIndex++, singleAnswer.Answer);
                    dr.SetField(startingIndex++, singleAnswer.AnswerNumber);

                    dt.Rows.Add(dr);
                }
            }
            return dt;
        }
    }
}
