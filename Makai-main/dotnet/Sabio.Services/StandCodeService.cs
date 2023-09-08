using Sabio.Data.Providers;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using Sabio.Data;
using Sabio.Models;
using Sabio.Models.Domain.StandCodes;

namespace Sabio.Services
{
    public class StandCodeService : IStandCodeService
    {
        IDataProvider _data = null;

        public StandCodeService(IDataProvider data)
        {
            _data = data;
        }

        #region ADD Request
        public Guid Add(int userId, int standId)
        {
            int id = 0;
            Guid uniqueCode = Guid.NewGuid();
            string procName = "[dbo].[StandCodes_Insert]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(col, userId, standId, uniqueCode);
                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;
                    col.Add(idOut);
                },
            returnParameters: delegate (SqlParameterCollection ReturnCollection)
            {
                object objId = ReturnCollection["@Id"].Value;
                int.TryParse(objId.ToString(), out id);
            });

            return uniqueCode;
        }
        #endregion


        #region GET METHODS
        public Paged<StandCode> GetPaginated(int pageIndex, int pageSize)
        {
            Paged<StandCode> pagedList = null;
            List<StandCode> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[StandCodes_SelectAll]", (param) =>
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
            },
            (reader, recordSetIndex) =>
            {
                int startingIndex = 0;

                StandCode standCode = MapSingleStandCode(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<StandCode>();
                }
                list.Add(standCode);
            });
            if (list != null)
            {
                pagedList = new Paged<StandCode>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public StandCode GetById(int id)
        {
            string procName = "[dbo].[StandCodes_Select_ById]";

            StandCode standCode = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);
            },
            delegate (IDataReader reader, short set)
            {
                int index = 0;
                standCode = MapSingleStandCode(reader, ref index);
            }
            );
            return standCode;
        }

        public StandCode GetByCode(string ucode)
        {
            string procName = "[dbo].[StandCodes_Select_ByCode]";

            StandCode standCode = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Code", ucode);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int index = 0;
                standCode = MapSingleStandCode(reader, ref index);
            }
            );
            return standCode;
        }
        #endregion

        #region DELETE
        public void Delete(int id)
        {
            string procName = "[dbo].[StandCodes_Delete_ById]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@Id", id);
                });
        } 
        #endregion

        #region COMMON PARAMS AND MAPPER
        private static void AddCommonParams(SqlParameterCollection col, int userId, int standId, Guid uCode)
        {
            col.AddWithValue("@UniqueCode", uCode);
            col.AddWithValue("@StandId", standId);
            col.AddWithValue("@CreatedBy", userId);
        }

        public StandCode MapSingleStandCode(IDataReader reader, ref int startingIndex)
        {
            StandCode standCode = new StandCode();

            standCode.Id = reader.GetSafeInt32(startingIndex++);
            standCode.UniqueCode = reader.GetSafeString(startingIndex++);
            standCode.StandId = reader.GetSafeInt32(startingIndex++);
            standCode.Longitude = reader.GetSafeDouble(startingIndex++);
            standCode.Latitude = reader.GetSafeDouble(startingIndex++);
            standCode.LineOne = reader.GetSafeString(startingIndex++);
            standCode.LineTwo = reader.GetSafeString(startingIndex++);
            standCode.City = reader.GetSafeString(startingIndex++);
            standCode.Zip = reader.GetSafeString(startingIndex++);
            standCode.PartnerId = reader.GetSafeInt32(startingIndex++);
            standCode.PartnerLogo = reader.GetSafeString(startingIndex++);
            standCode.DateCreated = reader.GetSafeDateTime(startingIndex++);
            standCode.CreatedBy = reader.GetSafeInt32(startingIndex++);

            return standCode;
        }
        #endregion
    }
}
