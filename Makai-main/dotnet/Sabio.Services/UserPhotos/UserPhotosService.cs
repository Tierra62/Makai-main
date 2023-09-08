using Microsoft.AspNetCore.Mvc;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain.Newsletters;
using Sabio.Models.Domain.UserPhotos;
using Sabio.Models.Requests.UserPhotos;
using Sabio.Services.Interfaces;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class UserPhotosService : IUserPhotosService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;

        public UserPhotosService(IDataProvider data, IBaseUserMapper userMapper)
        {
            _data = data;
            _userMapper = userMapper;
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[UserPhotos_Delete]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                },
                returnParameters: null);
        }

        public List<UserPhotos> Get(int CreatedBy)
        {
            string procName = "[dbo].[UserPhotos_SelectCreatedBy]";
            List<UserPhotos> list = null;   

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@CreatedBy", CreatedBy);
            }, 
            delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                UserPhotos userphotos = MapSingleUserPhoto(reader, ref startingIndex); 

                if(list == null)
                {
                    list = new List<UserPhotos>();
                } 
                list.Add(userphotos);
            },
            returnParameters: null);
            return list;
        }
        
        public Paged<UserPhotos> GetByIsApproved(int pageIndex, int pageSize, bool isApproved)
        {
            Paged<UserPhotos> pagedUserPhotos = null;
            List<UserPhotos> userPhotosList = null;
            int totalCount = 0;
            string procName = "[dbo].[UserPhotos_SelectByIsApproved_Paginated]";

            _data.ExecuteCmd(procName,
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@PageIndex", pageIndex);
                    col.AddWithValue("@PageSize", pageSize);
                    col.AddWithValue("@IsApproved", isApproved);

                }, delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    UserPhotos userPhoto = MapSingleUserPhoto(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (userPhotosList == null)
                    {
                        userPhotosList = new List<UserPhotos>();
                    }
                    userPhotosList.Add(userPhoto);
                }
                );
            if (userPhotosList != null)
            {
                pagedUserPhotos = new Paged<UserPhotos>(userPhotosList, pageIndex, pageSize, totalCount);
            }
            return pagedUserPhotos;
        }


        public Paged<UserPhotos> GetByNotApproved(int pageIndex, int pageSize, bool isApproved)
        {
            Paged<UserPhotos> pagedUserPhotos = null;
            List<UserPhotos> userPhotosList = null;
            int totalCount = 0;
            string procName = "[dbo].[UserPhotos_SelectByNotApproved_Paginated]";

            _data.ExecuteCmd(procName,
                delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@PageIndex", pageIndex);
                    col.AddWithValue("@PageSize", pageSize);
                    col.AddWithValue("@IsApproved", isApproved);

                }, delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    UserPhotos userPhoto = MapSingleUserPhoto(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (userPhotosList == null)
                    {
                        userPhotosList = new List<UserPhotos>();
                    }
                    userPhotosList.Add(userPhoto);
                }
                );
            if (userPhotosList != null) 
            {
                pagedUserPhotos = new Paged<UserPhotos>(userPhotosList, pageIndex, pageSize, totalCount);
            }
            return pagedUserPhotos;
        }

        public int Add(UserPhotosAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[UserPhotos_Insert]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col, userId);
      

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

        public void Update(UserPhotosUpdateRequest model, int userId)
        {
            string procName = "[dbo].[UserPhotos_Update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddUpdateParams(model, col, userId);
                col.AddWithValue("@Id", model.Id);
            
            },
                returnParameters: null);
        }  

        public void UpdateIsApproved(UserPhotosUpdateIsApprovedRequest model, int userId)
        {
            string procName = "[dbo].[UserPhotos_Update_IsApproved]";
            _data.ExecuteNonQuery(procName, 
                inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", model.Id);
                col.AddWithValue("@IsApproved", model.IsApproved);
            },
            returnParameters: null);
        }

        private UserPhotos MapSingleUserPhoto(IDataReader reader, ref int startingIndex )
        {
            UserPhotos userPhoto = new UserPhotos();


            userPhoto.Id = reader.GetSafeInt32(startingIndex++);
            userPhoto.User = _userMapper.MapUser(reader, ref startingIndex); 
            userPhoto.StandId = reader.GetSafeInt32(startingIndex++);
            userPhoto.PartnerId = reader.GetSafeInt32(startingIndex++);
            userPhoto.ImageUrl = reader.GetSafeString(startingIndex++);
            userPhoto.DateCreated = reader.GetSafeDateTime(startingIndex++);
            userPhoto.DateModified = reader.GetSafeDateTime(startingIndex++);
            userPhoto.IsApproved = reader.GetSafeBool(startingIndex++);
            userPhoto.ApprovedBy = reader.GetSafeInt32(startingIndex++);
            userPhoto.Name = reader.GetSafeString(startingIndex++);
            return userPhoto;
        }

        private static void AddCommonParams(UserPhotosAddRequest model, SqlParameterCollection col, int userId)
        {

            col.AddWithValue("@CreatedBy", userId);
            col.AddWithValue("@ProductId", model.ProductId);
            col.AddWithValue("@ImageUrl", model.ImageUrl);
        }

        private static void AddUpdateParams(UserPhotosUpdateRequest model, SqlParameterCollection col, int userId)
        {

            col.AddWithValue("@CreatedBy", userId);
            col.AddWithValue("@PartnerId", model.PartnerId);
            col.AddWithValue("@StandId", model.StandId);
            col.AddWithValue("@ImageUrl", model.ImageUrl);
            col.AddWithValue("@ApprovedBy", userId);
          
        }


    }
}
