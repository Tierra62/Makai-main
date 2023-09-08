using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain.Reservations;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Reservations;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Reservations
{
    public class ReservationService : IReservationService
    {
        IDataProvider _data = null;
        IAuthenticationService<int> _authService= null;
        IBaseUserMapper _userMapper = null;

        public ReservationService(IAuthenticationService<int> authService
            , IDataProvider data 
            , IBaseUserMapper userMapper)
        {
            _data = data;
            _authService = authService;
            _userMapper = userMapper;
        }

        public int Add(ReservationAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[Reservations_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@UserId", userId);
                AddCommonParams(model, col);
                
                SqlParameter idOut = new SqlParameter("@Id", System.Data.SqlDbType.Int);
                idOut.Direction = System.Data.ParameterDirection.Output;
                col.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });

            return id;
        }

        public Paged<Reservation> GetPaginated(int pageIndex, int pageSize)
        {
            Paged<Reservation> pagedList = null;
            List<Reservation> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Reservations_SelectAll_Paginated]", (param) =>
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
            },
            (reader, recordSetIndex) =>
            {
                int startingIndex = 0;

                Reservation reservation = MapSingleReservation(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Reservation>();
                }
                list.Add(reservation);
            });
            if(list != null)
            {
                pagedList = new Paged<Reservation>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Reservation GetById(int id)
        {
            Reservation reservation = null;
            int startingIndex = 0;

            _data.ExecuteCmd("[dbo].[Reservations_Select_ById]", inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@Id", id);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                reservation = MapSingleReservation(reader, ref startingIndex);
            });
            return reservation;
        }

        public Paged<Reservation> GetByCreatedBy(int pageIndex, int pageSize, int creator)
        {
            Paged<Reservation> pagedList = null;
            List<Reservation> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Reservations_Select_ByCreatedBy]", (param) =>
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
                param.AddWithValue("@UserId", creator);
            },
            (reader, recordSetIndex) =>
            {
                int startingIndex = 0;

                Reservation reservation = MapSingleReservation(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Reservation>();
                }
                list.Add(reservation);
            });
            if (list != null)
            {
                pagedList = new Paged<Reservation>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public void Update(ReservationUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Reservations_Update]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", model.Id);
                col.AddWithValue("@UserId", userId);
                AddCommonParams(model, col);
            },
            returnParameters: null);
        }

        public void UpdateStatusByProductId(int productId, int statusId)
        {
            string procName = "[dbo].[Reservations_Update_StatusByProductId]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@ProductId", productId);
                col.AddWithValue("@StatusId", statusId);
            },
            returnParameters: null);
        }

        public void UpdateStatusByChargeId(string chargeId, int statusId)
        {
            string procName = "[dbo].[Reservations_Update_StatusByChargeId]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@ChargeId", chargeId);
                col.AddWithValue("@StatusId", statusId);
            },
            returnParameters: null);
        }

        public Reservation MapSingleReservation(IDataReader reader, ref int startingIndex)
        {
            Reservation reservation = new Reservation();

            reservation.Id = reader.GetSafeInt32(startingIndex++);
            reservation.ProductId = reader.GetSafeInt32(startingIndex++);
            reservation.DateCheckIn = reader.GetSafeDateTime(startingIndex++);
            reservation.RentalTime = reader.GetSafeInt32(startingIndex++);
            reservation.ChargeId = reader.GetSafeString(startingIndex++);
            reservation.StatusId = reader.GetSafeInt32(startingIndex++);
            reservation.Name = reader.GetSafeString(startingIndex++);
            reservation.User = _userMapper.MapUser(reader, ref startingIndex);
            reservation.DateCreated = reader.GetSafeDateTime(startingIndex++);
            reservation.DateModified = reader.GetSafeDateTime(startingIndex++);

            return reservation;
        }
        private static void AddCommonParams(ReservationAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@ProductId", model.ProductId);
            col.AddWithValue("@DateCheckIn", model.DateCheckIn);
            col.AddWithValue("@RentalTime", model.RentalTime);
            col.AddWithValue("@ChargeId", model.ChargeId);
            col.AddWithValue("@StatusId", model.StatusId);
        }
        
    }
}
