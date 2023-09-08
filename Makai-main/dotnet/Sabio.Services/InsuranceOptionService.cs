using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain.InsuranceOptions;
using Sabio.Models.Requests.InsuranceOptions;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class InsuranceOptionService : IInsuranceOptionService
    {
        private IDataProvider _data;

        public InsuranceOptionService(IDataProvider data)
        {
            _data = data;
        }

        public InsuranceOption GetById(int id)
        {
            InsuranceOption insuranceOption = null;
            string procName = "[dbo].[InsuranceOptions_SelectById]";
            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection inputParams)
                {
                    inputParams.AddWithValue("@Id", id);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int starting = 0;
                    insuranceOption = SingleInsuranceOptionMapper(reader, ref starting);
                });
            return insuranceOption;
        }

        public List<InsuranceOption> GetAll()
        {
            List<InsuranceOption> list = null;
            string procName = "[dbo].[InsuranceOptions_SelectAll]";
            _data.ExecuteCmd(procName, inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int starting = 0;
                    InsuranceOption insuranceOption = SingleInsuranceOptionMapper(reader, ref starting);
                    if (list == null)
                    {
                        list = new List<InsuranceOption>();
                    }
                    list.Add(insuranceOption);
                });
            return list;
        }

        private InsuranceOption SingleInsuranceOptionMapper(IDataReader reader, ref int starting)
        {
            // Don't worry about null becuase we are using GetSafeDataType instead of GetDataType
            InsuranceOption aInsuranceOption = new InsuranceOption();
            aInsuranceOption.Id = reader.GetSafeInt32(starting++);
            aInsuranceOption.OrderId = reader.GetSafeInt32(starting++);
            aInsuranceOption.OrderStartTime = reader.GetSafeDateTime(starting++);
            aInsuranceOption.OrderEstimatedStop = reader.GetSafeDateTime(starting++);
            aInsuranceOption.OrderActualStop = reader.GetSafeDateTime(starting++);
            aInsuranceOption.OrderPriceInCents = reader.GetSafeInt32(starting++);
            aInsuranceOption.OrderPriceWithTax = reader.GetSafeInt32(starting++);
            aInsuranceOption.StartTime = reader.GetSafeDateTime(starting++);
            aInsuranceOption.EndTime = reader.GetSafeDateTime(starting++);
            aInsuranceOption.Cost = reader.GetSafeInt32(starting++);
            aInsuranceOption.IsActive = reader.GetSafeBool(starting++);
            aInsuranceOption.IsCancelled = reader.GetSafeBool(starting++);
            aInsuranceOption.CancelationDate = reader.GetSafeDateTime(starting++);
            aInsuranceOption.CreatedById = reader.GetSafeInt32(starting++);
            aInsuranceOption.CreatedByFirstName = reader.GetSafeString(starting++);
            aInsuranceOption.CreatedByLastName = reader.GetSafeString(starting++);
            aInsuranceOption.CreatedByEmail = reader.GetSafeString(starting++);
            aInsuranceOption.CreatedByPhone = reader.GetSafeString(starting++);
            aInsuranceOption.ModifiedById = reader.GetSafeInt32(starting++);
            aInsuranceOption.ModifiedByFirstName = reader.GetSafeString(starting++);
            aInsuranceOption.ModifiedByLastName = reader.GetSafeString(starting++);
            aInsuranceOption.ModifiedByEmail = reader.GetSafeString(starting++);
            aInsuranceOption.ModifiedByPhone = reader.GetSafeString(starting++);
            aInsuranceOption.DateCreated = reader.GetSafeDateTime(starting++);
            aInsuranceOption.DateModified = reader.GetSafeDateTime(starting++);
            return aInsuranceOption;
        }
    
        public int Add(InsuranceOptionAddRequest model, int userId)
        {
            int insuranceOptionId = 0;
            string procName = "[dbo].[InsuranceOptions_Insert]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection inputParams)
                {
                    AddCommonParams(model, inputParams, userId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;
                    inputParams.Add(idOut);
                },
                returnParameters: delegate (SqlParameterCollection returnParams)
                {
                    object idOut = returnParams["@Id"].Value;
                    Int32.TryParse(idOut.ToString(), out insuranceOptionId);

                });
            return insuranceOptionId;
        }

        public void Update(InsuranceOptionUpdateRequest model, int userId)
        {
            string procName = "[dbo].[InsuranceOptions_Update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection inputParams)
                {
                    inputParams.AddWithValue("@Id", model.Id);
                    AddCommonParams(model, inputParams, userId);
                },
                returnParameters: null);
        }

        public void Delete(int insuranceOptionId, int userId)
        {
            string procName = "[dbo].[InsuranceOptions_DeleteById]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection inputParams)
                {
                    inputParams.AddWithValue("@Id", insuranceOptionId);
                    inputParams.AddWithValue("@UserId", userId);
                },
                returnParameters: null);
        }

        private static void AddCommonParams(InsuranceOptionAddRequest model, SqlParameterCollection inputParams, int userId)
        {
            inputParams.AddWithValue("@OrderId", model.OrderId);
            inputParams.AddWithValue("@UserId", userId);
            inputParams.AddWithValue("@Cost", model.Cost);
        }
    }
}
