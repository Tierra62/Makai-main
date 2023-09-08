using Newtonsoft.Json;
using Sabio.Data.Providers;
using Sabio.Models.Domain.Surveys;
using Sabio.Models.Requests.Surveys;
using Sabio.Models;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Data;
using System.Drawing.Printing;
using Sabio.Models.Domain.SurveyDetails;

namespace Sabio.Services
{
    public class SurveyService : ISurveyService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        ILookUpService _lookUpMapper = null;
        public SurveyService(IDataProvider data, IBaseUserMapper userMapper, ILookUpService lookUpMapper)
        {
            _data = data;
            _userMapper = userMapper;
            _lookUpMapper = lookUpMapper;
        }

        public int Add(int userId, SurveyAddRequest request)
        {
            int id = 0;
            string procName = "[dbo].[Surveys_Insert]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(request, col, userId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);

                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;

                    int.TryParse(oId.ToString(), out id);
                });

            return id;
        }

        public Survey Get(int id)
        {
            string procName = "[dbo].[Surveys_SelectById]";

            Survey survey = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);
            },
            delegate (IDataReader reader, short set)
            {
                int index = 0;
                survey = MapSingleSurvey(reader, ref index);
            }
            );
            return survey;
        }
        public Paged<SearchSurvey> SearchPaginated(int pageIndex, int pageSize, string query)
        {
            Paged<SearchSurvey> pagedList = null;
            List<SearchSurvey> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                "dbo.Surveys_SearchPaginate",
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@Query", query);

                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    SearchSurvey survey = MapSingleSearchSurvey(reader, ref startingIndex);
                    totalCount = reader.GetSafeInt32(startingIndex++);
                    if (list == null)
                    {
                        list = new List<SearchSurvey>();
                    }
                    list.Add(survey);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<SearchSurvey>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public Paged<Survey> GetCreatedBy(int pageIndex, int pageSize, int id)
        {
            string procName = "[dbo].[Surveys_Select_ByCreatedBy]";

            Paged<Survey> pagedList = null;
            List<Survey> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName,
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@CreatedBy", id);
                },
                (reader, recordSetIndex) =>
                {
                    int index = 0;

                    Survey survey = MapSingleSurvey(reader, ref index);
                    totalCount = reader.GetSafeInt32(index++);

                    if (list == null)
                    {
                        list = new List<Survey>();
                    }
                    list.Add(survey);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<Survey>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public void Update(int userId, SurveyUpdateRequest update)
        {

            string procName = "[dbo].[Surveys_Update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {

                    AddCommonParams(update, col, userId);
                    col.AddWithValue("@Id", update.Id);

                },
                returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Surveys_DeleteById]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@Id", id);
                });
        }

        public Paged<Survey> GetAll(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Surveys_SelectAll]";

            Paged<Survey> pagedList = null;
            List<Survey> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName,
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                },
                (reader, recordSetIndex) =>
                {
                    int index = 0;

                    Survey survey = MapSingleSurvey(reader, ref index);
                    totalCount = reader.GetSafeInt32(index++);
                    survey.NumberOfInstances = reader.GetSafeInt32(index++);

                    if (list == null)
                    {
                        list = new List<Survey>();
                    }
                    list.Add(survey);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<Survey>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }
        public SurveyDetail GetDetails(int id)
        {
            string procName = "[dbo].[Surveys_SelectById_Details]";
            SurveyDetail surveyDetail = new SurveyDetail();
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);
            },
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                surveyDetail.Id = reader.GetSafeInt32(startingIndex++);
                surveyDetail.Name = reader.GetSafeString(startingIndex++);
                surveyDetail.Questions = reader.DeserializeObject<List<SingleQuestion>>(startingIndex++);
            }
            );
            return surveyDetail;
        }


        private void AddCommonParams(SurveyAddRequest request, SqlParameterCollection col, int userId)
        {
            col.AddWithValue("@Name", request.Name);
            col.AddWithValue("@Description", request.Description);
            col.AddWithValue("@StatusId", request.StatusId);
            col.AddWithValue("@SurveyTypeId", request.SurveyTypeId);
            col.AddWithValue("@CreatedBy", userId);
        }

        public Survey MapSingleSurvey(IDataReader reader, ref int startingIndex)
        {
            Survey survey = new Survey();

            survey.Id = reader.GetSafeInt32(startingIndex++);
            survey.Name = reader.GetSafeString(startingIndex++);
            survey.Description = reader.GetSafeString(startingIndex++);

            survey.SurveyStatus = _lookUpMapper.MapSingleLookUp(reader, ref startingIndex);

            survey.SurveyType = _lookUpMapper.MapSingleLookUp(reader, ref startingIndex);

            survey.User = _userMapper.MapUser(reader, ref startingIndex);

            survey.DateCreated = reader.GetSafeDateTime(startingIndex++);
            survey.DateModified = reader.GetSafeDateTime(startingIndex++);           

            return survey;
        }
        public SearchSurvey MapSingleSearchSurvey(IDataReader reader, ref int startingIndex)
        {
            SearchSurvey survey = new SearchSurvey();

            survey.Id = reader.GetSafeInt32(startingIndex++);
            survey.Name = reader.GetSafeString(startingIndex++);
            survey.Description = reader.GetSafeString(startingIndex++);
            survey.Question = reader.GetSafeString(startingIndex++);
            survey.StatusId = _lookUpMapper.MapSingleLookUp(reader, ref startingIndex);
            survey.DateCreated = reader.GetSafeDateTime(startingIndex++);
            survey.DateModified = reader.GetSafeDateTime(startingIndex++);

            return survey;
        }
    }
}
