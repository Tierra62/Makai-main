using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Stands;
using Sabio.Models.Domain.StandReturns;
using Sabio.Models.Requests.StandReturns;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Domain.Partners;

namespace Sabio.Services
{
    public class StandReturnService : IStandReturnService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        IStandService _standService = null;
        IFileService _fileService = null;


        public StandReturnService (IDataProvider data
            , IBaseUserMapper userMapper
            , IStandService standService
            , IFileService fileService)
        {
            _data = data;
            _userMapper = userMapper;
            _standService = standService;
            _fileService = fileService;

        }

        #region Add/Update
        public int Add(StandReturnAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[StandReturns_Insert]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@StandId", model.StandId);
                    col.AddWithValue("@ImageName", model.ImageName);
                    col.AddWithValue("@ImageUrl", model.ImageUrl);
                    col.AddWithValue("@ImageTypeId", model.ImageTypeId);
                    col.AddWithValue("@CreatedBy", userId);
                    col.AddWithValue("@IsDamaged", model.IsDamaged);


                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;

                    int.TryParse(oId.ToString(), out id);
                }
                );
            return id;
        }

        public void Update(ImageUpdateRequest model)
        {
            string procName = "[dbo].[StandReturns_Update_Image]";
            _data.ExecuteNonQuery(procName
                , inputParamMapper: delegate (SqlParameterCollection col)
                {
                    
                    col.AddWithValue("@Id", model.Id);
                    col.AddWithValue("@StandId", model.StandId);
                    col.AddWithValue("@ImageName", model.ImageName);
                    col.AddWithValue("@ImageUrl", model.ImageUrl);
                    col.AddWithValue("@ImageTypeId", model.ImageTypeId);
                    col.AddWithValue("@IsDamaged", model.IsDamaged);


                },
                returnParameters: null);
        }
        #endregion

        #region Gets paginated
        public Paged<StandReturnDetails> GetByUserId(int userId, int pageIndex, int pageSize)
        {
            string procName = "[dbo].[StandReturns_SelectByUserId_Paginated]";
            Paged<StandReturnDetails> pagedList = null;
            List<StandReturnDetails> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@UserId", userId);
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);

                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    StandReturnDetails standReturn = MapSingleStandReturn(reader, ref startingIndex);
                    totalCount = reader.GetInt32(startingIndex++);
                    if (list == null)
                    {
                        list = new List<StandReturnDetails>();
                    }
                    list.Add(standReturn);
                });
            if (list != null)
            {
                pagedList = new Paged<StandReturnDetails>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }

        public Paged<StandReturnDetails> GetByStandId(int standId, int pageIndex, int pageSize)
        {
            string procName = "[dbo].[StandReturns_SelectByStandId_Paginated]";
            Paged<StandReturnDetails> pagedList = null;
            List<StandReturnDetails> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@standId", standId);
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);

                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    StandReturnDetails standReturn = MapSingleStandReturn(reader, ref startingIndex);
                    totalCount = reader.GetInt32(startingIndex++);
                    if (list == null)
                    {
                        list = new List<StandReturnDetails>();
                    }
                    list.Add(standReturn);

                });
            if (list != null)
            {
                pagedList = new Paged<StandReturnDetails>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<StandReturnDetails> GetAll(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[StandReturns_SelectAll_Paginated]";
            Paged<StandReturnDetails> pagedList = null;
            List<StandReturnDetails> list = null;
            int totalCount = 0;
            _data.ExecuteCmd(procName
                , inputParamMapper: delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                }
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    StandReturnDetails standReturn = MapSingleStandReturn(reader, ref startingIndex);
                    totalCount = reader.GetInt32(startingIndex++);
                    if (list == null)
                    {
                        list = new List<StandReturnDetails>();
                    }
                    list.Add(standReturn);
                });
            if (list != null)
            {
                pagedList = new Paged<StandReturnDetails>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        } 
        #endregion

       public StandReturnDetails MapSingleStandReturn(IDataReader reader, ref int startingIndex)
        {
            StandReturnDetails standReturn = null;
            StandDetails standDetails = null;
            BaseUser user = null;
            File file = null;


            standReturn = new StandReturnDetails();
            standReturn.Id = reader.GetSafeInt32(startingIndex++);

            standDetails = new StandDetails();
            standDetails = _standService.MapSingleStand(reader, ref startingIndex);
            standReturn.Stand = standDetails;

            user = new BaseUser();
            user = _userMapper.MapUser(reader, ref startingIndex);
            standReturn.User = user;

            file = new File();
            file = _fileService.MapSingleFile(reader, ref startingIndex);
            standReturn.Image = file;

            standReturn.IsDamaged = reader.GetSafeBool(startingIndex++);
            standReturn.DateCreated = reader.GetSafeDateTime(startingIndex++);

            return standReturn;

        }
    }
}
