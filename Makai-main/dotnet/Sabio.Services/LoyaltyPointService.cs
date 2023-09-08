using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.LoyaltyPoints;
using Sabio.Models.Domain.StandReturns;
using Sabio.Models.Domain.Stands;
using Sabio.Models.Requests.LoyaltyPoints;
using Sabio.Services.Interfaces;
using Stripe;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class LoyaltyPointService : ILoyaltyPointService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        public LoyaltyPointService(IDataProvider data, IBaseUserMapper userMapper, ILoyaltyPointSourceService loyaltyPointSourceService)
        {
            _data = data;
            _userMapper = userMapper; 
        }

        public int Add(LoyaltyPointAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[LoyaltyPoints_Insert]";
            _data.ExecuteNonQuery(
                procName
                , inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@UserId", userId);
                    col.AddWithValue("@SourceId", model.SourceId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                }, returnParameters: delegate (SqlParameterCollection returnCol)
                {
                    object oId = returnCol["@Id"].Value;
                    Int32.TryParse(oId.ToString(), out id);
                }
                );
            return id;
        }

        public Paged<LoyaltyPoint> GetByUserId(int pageIndex, int pageSize, int userId)
        {
            Paged<LoyaltyPoint> pagedListOfLoyaltyPoints = null;
            List<LoyaltyPoint> list = null;
            string procName = "[dbo].[LoyaltyPoints_SelectByUserId_Paginated]";
            int totalCount = 0;

            _data.ExecuteCmd(
                procName
                , inputParamMapper: delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@UserId", userId);
                }, singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    LoyaltyPoint aLoyaltyPoint  = MapSingleLoyaltyPoint (reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }
                    if (list == null)
                    {
                        list = new List<LoyaltyPoint>();
                    }
                    list.Add(aLoyaltyPoint);
                });
            if (list != null)
            {
                pagedListOfLoyaltyPoints = new Paged<LoyaltyPoint>(list, pageIndex, pageSize, totalCount);
            }
            return pagedListOfLoyaltyPoints;

        }

        public LoyaltyPointsTotal GetByUserId_RunningTotal(int userId)
        {
            LoyaltyPointsTotal loyaltyPointsTotal = null;
            string procName = "[dbo].[LoyaltyPoints_SelectByUserId_RunningTotals]";
            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@UserId", userId);
                }, singleRecordMapper: delegate (IDataReader reader, short set)

                {
                    loyaltyPointsTotal = new LoyaltyPointsTotal();
                    int startingIndex = 0;
                    loyaltyPointsTotal.User = _userMapper.MapUser(reader,ref startingIndex);

                    loyaltyPointsTotal.TotalLifeTimePoints = reader.GetSafeInt32(startingIndex++);
                    loyaltyPointsTotal.TotalPointsRedeemed = reader.GetSafeInt32(startingIndex++);
                    loyaltyPointsTotal.TotalPointsAvailable = reader.GetSafeInt32(startingIndex++);
                    
                });
            return loyaltyPointsTotal;
        }

        #region Private MapSingleLoyaltyPoint
        private LoyaltyPoint MapSingleLoyaltyPoint(IDataReader reader, ref int startingIndex)
        {
            LoyaltyPoint aLoyaltyPoint = new LoyaltyPoint();

            aLoyaltyPoint.Id = reader.GetSafeInt32(startingIndex++);

            aLoyaltyPoint.User = _userMapper.MapUser(reader, ref startingIndex);

            aLoyaltyPoint.LoyaltyPointSource = new LoyaltyPointSource();
            aLoyaltyPoint.LoyaltyPointSource.Id = reader.GetSafeInt32(startingIndex++);
            aLoyaltyPoint.LoyaltyPointSource.Name = reader.GetSafeString(startingIndex++);
            aLoyaltyPoint.LoyaltyPointSource.PointsAwarded = reader.GetSafeInt32(startingIndex++);
            aLoyaltyPoint.LoyaltyPointSource.IsDeleted = reader.GetBoolean(startingIndex++);
            aLoyaltyPoint.LoyaltyPointSource.IsExpired = reader.GetBoolean(startingIndex++);
            aLoyaltyPoint.LoyaltyPointSource.DateExpire = reader.GetSafeDateTime(startingIndex++);  
            aLoyaltyPoint.LoyaltyPointSource.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aLoyaltyPoint.LoyaltyPointSource.DateModified = reader.GetSafeDateTime(startingIndex++);

            aLoyaltyPoint.LoyaltyPointSource.CreatedBy = _userMapper.MapUser(reader, ref startingIndex);
            aLoyaltyPoint.LoyaltyPointSource.ModifiedBy = _userMapper.MapUser(reader, ref startingIndex);

            aLoyaltyPoint.DateCreated = reader.GetSafeDateTime(startingIndex++);
            return aLoyaltyPoint;
            
        } 
        #endregion

    }
}
