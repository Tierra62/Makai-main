using Sabio.Data.Providers;
using Sabio.Models.Requests.Surveys;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Domain.Surveys;
using Sabio.Models.Domain.SurveyInstances;
using Sabio.Data;
using Sabio.Models.Requests.SurveyInstances;

namespace Sabio.Services
{
    public class SurveyInstanceService : ISurveyInstanceService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        ILookUpService _lookUpMapper = null;
        public SurveyInstanceService(IDataProvider data, IBaseUserMapper userMapper, ILookUpService lookUpMapper)
        {
            _data = data;
            _userMapper = userMapper;
            _lookUpMapper = lookUpMapper;
        }

        public int Add(int userId, SurveyInstanceAddRequest request)
        {
            int id = 0;
            string procName = "[dbo].[SurveyInstances_Insert]";

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
        public SurveyInstance Get(int id)
        {
            string procName = "[dbo].[SurveyInstances_Select_ById]";

            SurveyInstance surveyInstance = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);
            },
            delegate (IDataReader reader, short set)
            {
                int index = 0;
                surveyInstance = MapSingleSurveyInstance(reader, ref index);
            }
            );
            return surveyInstance;
        }
        private void AddCommonParams(SurveyInstanceAddRequest request, SqlParameterCollection col, int userId)
        {
            col.AddWithValue("@SurveyId", request.SurveyId);
            col.AddWithValue("@UserId", userId);
            col.AddWithValue("@DateCreated", request.DateCreated);
            col.AddWithValue("@DateModified", request.DateModified);
        }
        public SurveyInstance MapSingleSurveyInstance(IDataReader reader, ref int startingIndex)
        {
            SurveyInstance survey = new SurveyInstance();

            survey.Id = reader.GetSafeInt32(startingIndex++);
            survey.SurveyId = reader.GetSafeInt32(startingIndex++);
            survey.UserId = reader.GetSafeInt32(startingIndex++);
            survey.DateCreated = reader.GetSafeDateTime(startingIndex++);
            survey.DateModified = reader.GetSafeDateTime(startingIndex++);

            return survey;
        }

    }
}
