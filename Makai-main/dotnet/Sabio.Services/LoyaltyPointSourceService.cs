using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain.LoyaltyPoints;
using Sabio.Models.Requests.LoyaltyPoints;
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
    public class LoyaltyPointSourceService : ILoyaltyPointSourceService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        public LoyaltyPointSourceService(IDataProvider data, IBaseUserMapper userMapper)
        {
            _data = data;
            _userMapper = userMapper;
        }

        public LoyaltyPointSource GetById(int id)
        {
            string procName = "[dbo].[LoyaltyPointsSource_SelectByIdV2]";

            LoyaltyPointSource aLoyaltyPointSource = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                aLoyaltyPointSource = MapSingleLoyaltyPointSource(reader, ref startingIndex);
            }
            );
            return aLoyaltyPointSource;
        }
        public Paged<LoyaltyPointSource> GetAll(int pageIndex, int pageSize)
        {
            Paged<LoyaltyPointSource> pagedListOfLoyaltyPointsSource = null;
            List<LoyaltyPointSource> list = null;
            string procName = "[dbo].[LoyaltyPointsSource_SelectAll_PaginatedV2]";
            int totalCount = 0;

            _data.ExecuteCmd(
                procName
                , inputParamMapper: delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                }, singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    LoyaltyPointSource aLoyaltyPointSource = MapSingleLoyaltyPointSource(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }
                    if (list == null)
                    {
                        list = new List<LoyaltyPointSource>();
                    }
                    list.Add(aLoyaltyPointSource);
                });
            if (list != null)
            {
                pagedListOfLoyaltyPointsSource = new Paged<LoyaltyPointSource>(list, pageIndex, pageSize, totalCount);
            }
            return pagedListOfLoyaltyPointsSource;

        }

        public int Add(LoyaltyPointSourceAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[LoyaltyPointsSource_Insert]";
            _data.ExecuteNonQuery(
                procName
                , inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, userId, col);
                    col.AddWithValue("@CreatedBy", userId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                }, returnParameters: delegate (SqlParameterCollection returnCol)
                {
                    object oId = returnCol["@Id"].Value;
                    int.TryParse(oId.ToString(), out id);
                });
            return id;
        }

        public void Update(LoyaltyPointSourceUpdateRequest model, int userId)
        {
            string procName = "[dbo].[LoyaltyPointsSource_Update]";
            _data.ExecuteNonQuery(
                procName
                , inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", model.Id);
                    AddCommonParams(model, userId, col);
                },
                returnParameters: null);
        }

        public void UpdateIsDeleted(int id, int userId)
        {
            string procName = "[dbo].[LoyaltyPointsSource_Update_IsDeleted]";
            _data.ExecuteNonQuery(
                procName
                , inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParamsSoftModify(id, userId, col);
                },
                returnParameters: null);
        }

        public void UpdateIsExpired(int id, int userId)
        {
            string procName = "[dbo].[LoyaltyPointsSource_Update_IsExpiredV2]";
            _data.ExecuteNonQuery(
                procName
                , inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParamsSoftModify(id, userId, col);
                },
                returnParameters: null);
        }

        #region Private AddCommonParams

        private LoyaltyPointSource MapSingleLoyaltyPointSource(IDataReader reader, ref int startingIndex)
        {
            LoyaltyPointSource aLoyaltyPointSource = new LoyaltyPointSource();

            aLoyaltyPointSource.Id = reader.GetSafeInt32(startingIndex++);
            aLoyaltyPointSource.Name = reader.GetSafeString(startingIndex++);
            aLoyaltyPointSource.PointsAwarded = reader.GetSafeInt32(startingIndex++);
            aLoyaltyPointSource.IsDeleted = reader.GetSafeBool(startingIndex++);
            aLoyaltyPointSource.IsExpired = reader.GetSafeBool(startingIndex++);
            aLoyaltyPointSource.DateExpire = reader.GetSafeDateTime(startingIndex++);
            aLoyaltyPointSource.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aLoyaltyPointSource.DateModified = reader.GetSafeDateTime(startingIndex++);

            aLoyaltyPointSource.CreatedBy = _userMapper.MapUser(reader, ref startingIndex);
            aLoyaltyPointSource.ModifiedBy = _userMapper.MapUser(reader, ref startingIndex);
            return aLoyaltyPointSource;
        }
        private static void AddCommonParamsSoftModify(int id, int userId, SqlParameterCollection col)
        {
            col.AddWithValue("@Id", id);
            col.AddWithValue("@ModifiedBy", userId);
        }
        private static void AddCommonParams(LoyaltyPointSourceAddRequest model, int userId, SqlParameterCollection col)
        {
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@PointsAwarded", model.PointsAwarded);
            col.AddWithValue("@ModifiedBy", userId);
            col.AddWithValue("@DateExpire", model.DateExpire);
        } 
        #endregion
    }
}
