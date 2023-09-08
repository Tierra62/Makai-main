using Amazon.Runtime.Internal.Util;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Blogs;
using Sabio.Models.Domain.Ratings;
using Sabio.Models.Requests.Blogs;
using Sabio.Models.Requests.Ratings;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Sabio.Services
{
    public class RatingService : IRatingService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        ILookUpService _lookUpService = null;


        public RatingService(IDataProvider data, IBaseUserMapper userMapper, ILookUpService lookUpService)
        {
            _data = data;
            _userMapper = userMapper;
            _lookUpService = lookUpService;
        }

        public Paged<Ratings> GetByEntityId(int entityTypeId, int entityId, int pageIndex, int pageSize)
        {
            Paged<Ratings> pagedList = null;
            List<Ratings> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Ratings_Select_ByEntityId_Paginated]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@EntityTypeId", entityTypeId);
                paramCollection.AddWithValue("@EntityId", entityId);


            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Ratings rating = MapSingleRating(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<Ratings>(pageSize);
                }
                list.Add(rating);
            }
           );
            if (list != null)
            {
                pagedList = new Paged<Ratings>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public EntityRating GetAverage(int entityTypeId, int entityId)
        {
            EntityRating rating = null;

            string procName = "[dbo].[Ratings_SelectSummary_ByEntityId]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@EntityTypeId", entityTypeId);
                paramCollection.AddWithValue("@EntityId", entityId);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                rating = MapEntityRating(reader, ref startingIndex);
            }
            );
            return rating;
        }

        public int Add(RatingAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Ratings_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@CreatedBy", userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)

            {
                object objectId = returnCollection["@Id"].Value;

                int.TryParse(objectId.ToString(), out id);

            });

            return id;
        }

        public void Update(RatingUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Ratings_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@Id", model.Id);
                col.AddWithValue("@ModifiedBy", userId);
                col.AddWithValue("@IsDeleted", model.IsDeleted);


            }, returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Ratings_DeleteById]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            });
        }

        private static void AddCommonParams(RatingAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Rating", model.Rating);
            col.AddWithValue("@CommentId", model.CommentId);
            col.AddWithValue("@EntityTypeId", model.EntityTypeId);
            col.AddWithValue("@EntityId", model.EntityId);
        }

        private EntityRating MapEntityRating(IDataReader reader, ref int startingIndex)
        {
            EntityRating entityRating = new EntityRating();

            entityRating.AverageRating = reader.GetSafeInt32(startingIndex++);
            entityRating.TotalNumber = reader.GetSafeInt32(startingIndex++);

            return entityRating;
        }
        private Ratings MapSingleRating(IDataReader reader, ref int startingIndex)
        {
            Ratings aRating = new Ratings();

            aRating.Id = reader.GetSafeInt32(startingIndex++);
            aRating.Rating = reader.GetSafeByte(startingIndex++);         
            aRating.EntityType = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            aRating.EntityId = reader.GetSafeInt32(startingIndex++);
            aRating.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aRating.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            aRating.DateModified = reader.GetSafeDateTime(startingIndex++);
            aRating.IsDeleted = reader.GetSafeBool(startingIndex++);
            aRating.CommentId = reader.GetSafeInt32(startingIndex++);
            aRating.CreatedBy = reader.GetSafeInt32(startingIndex++);
            aRating.User = _userMapper.MapUser(reader, ref startingIndex);

            return aRating;
        }
    }

}

 
