using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Locations;
using Sabio.Models.Domain.Partners;
using Sabio.Models.Domain.Stands;
using Sabio.Models.Requests.Stands;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Drawing.Printing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class StandService : IStandService
    {
        IDataProvider _data = null;
        ILookUpService _lookUpService = null;
        IBaseUserMapper _userMapper = null;
        IPartnerService _partnerService = null;
        ILocationService _locationService = null;

        public StandService(IDataProvider data
            , ILookUpService lookUpService
            , IBaseUserMapper baseUserMapper
            , IPartnerService partnerService
            , ILocationService locationService)
        {
            _data = data;
            _lookUpService = lookUpService;
            _userMapper = baseUserMapper;
            _partnerService = partnerService;
            _locationService = locationService;
        }

        #region - ADD/UPDATE/DELETE -
        public int Add(StandAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Stands_Insert]";

            _data.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    AddCommonParams(model, parameters);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;
                    parameters.Add(idOut);
                }
                , returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object objectId = returnCollection["@Id"].Value;
                    int.TryParse(objectId.ToString(), out id);
                });
            return id;
        }

        public void Update(StandUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Stands_Update]";

            _data.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    AddCommonParams(model, parameters);
                    parameters.AddWithValue("@Id", model.Id);
                }
                , returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Stands_Delete]";

            _data.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    parameters.AddWithValue("@Id", id);
                }
                , returnParameters: null);
        }
        #endregion

        #region - GETS -
        public List<StandDetails> GetByUserId(int userId)
        {
            string procName = "[dbo].[StandsSelect_ByUserId]";
            List<StandDetails> list = null;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    parameters.AddWithValue("@UserId", userId);
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    StandDetails stand = MapSingleStand(reader, ref startingIndex);

                    if (list == null)
                    {
                        list = new List<StandDetails>();
                    }
                    list.Add(stand);
                });
            return list;
        }

        public List<StandDetails> GetAll()
        {
            string procName = "[dbo].[Stands_SelectAllV2]";
            List<StandDetails> list = null;
            _data.ExecuteCmd(procName, inputParamMapper: null
            , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                StandDetails aStand = MapSingleStand(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<StandDetails>();
                }
                list.Add(aStand);
            });
            return list;
        }

        public Paged<StandDetails> GetByGeo(StandGeoRequest model)
        {
            string procName = "[dbo].[StandsSelect_ByGeo]";
            Paged<StandDetails> pagedList = null;
            List<StandDetails> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection parameters)
                {
                    AddPageParams(model, parameters);
                    AddGeoParams(model, parameters);
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    StandDetails stand = MapSingleStand(reader, ref startingIndex);
                    totalCount = reader.GetSafeInt32(startingIndex++);

                    if (list == null)
                    {
                        list = new List<StandDetails>();
                    }
                    list.Add(stand);
                });
            if (list != null)
            {
                pagedList = new Paged<StandDetails>(list, model.PageIndex, model.PageSize, totalCount);
            }
            return pagedList;
        }

        public List<StandDetails> GetAllV2()
        {
            string procName = "[dbo].[Stands_SelectAllV2]";
            List<StandDetails> list = null;
            _data.ExecuteCmd(procName, inputParamMapper: null
            , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                StandDetails aStand = MapSingleStand(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<StandDetails>();
                }
                list.Add(aStand);
            });
            return list;
        }
        #endregion

        #region - PRIVATE -
        private static void AddCommonParams(StandAddRequest model, SqlParameterCollection parameters)
        {
            parameters.AddWithValue("@StandStatusId", model.StandStatusId);
            parameters.AddWithValue("@StandTypeId", model.StandTypeId);
            parameters.AddWithValue("@PartnerId", model.PartnerId);
            parameters.AddWithValue("@IsPrivate", model.IsPrivate);
            parameters.AddWithValue("@IsReservable", model.IsReservable);
            parameters.AddWithValue("@LocationId", model.LocationId);
            parameters.AddWithValue("@DateOpened", model.DateOpened);
        }

        private static void AddPageParams(StandGeoRequest model, SqlParameterCollection parameters)
        {
            parameters.AddWithValue("@PageIndex", model.PageIndex);
            parameters.AddWithValue("@PageSize", model.PageSize);
        }

        private static void AddGeoParams(StandGeoRequest model, SqlParameterCollection parameters)
        {
            parameters.AddWithValue("@Latitude", model.Latitude);
            parameters.AddWithValue("@Longitude", model.Longitude);
            parameters.AddWithValue("@Distance", model.Distance);
        }

        public StandDetails MapSingleStand(IDataReader reader, ref int startingIndex)
        {
            StandDetails stand = null;
            Partner partner = null;
            Location location = null;

            stand = new StandDetails();
            stand.Id = reader.GetSafeInt32(startingIndex++);
            stand.StandStatus = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            stand.StandType = _lookUpService.MapSingleLookUp(reader, ref startingIndex);

            partner = new Partner();
            partner = _partnerService.MapSinglePartner(reader, ref startingIndex);
            stand.Partner = partner;

            stand.IsPrivate = reader.GetSafeBool(startingIndex++);
            stand.IsReservable = reader.GetSafeBool(startingIndex++);

            location = new Location();
            location = _locationService.MapSingleLocation(reader, ref startingIndex);
            stand.Location = location;

            stand.DateOpened = reader.GetSafeDateTime(startingIndex++);
            stand.CreatedBy = _userMapper.MapUser(reader, ref startingIndex);
            stand.ModifiedBy = _userMapper.MapUser(reader, ref startingIndex);

            return stand;
        }

        #endregion
    }
}
