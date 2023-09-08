using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Requests.Reviews;
using Sabio.Models.Domain.Reviews;

namespace Sabio.Services
{
    public class ReviewService : IReviewService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        public ReviewService(IDataProvider data, IBaseUserMapper userMapper)
        {
            _data = data;
            _userMapper = userMapper;
        }

        public int Add(int userId, ReviewAddRequest request)
        {
            int id = 0;
            string procName = "[dbo].[Reviews_Insert]";

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

        public List<Review> Get(int id)
        {
            string procName = "[dbo].[Reviews_Select_ByEntityId]";
            List<Review> list = null;
            

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@EntityId", id);
            },
            delegate (IDataReader reader, short set)
            {
                int index = 0;

                Review review = MapSingleReview(reader, ref index);

                if (list == null)
                {
                    list = new List<Review>();
                }
                list.Add(review);
            }
            );
            return list;
        }

        public void Update(int userId, ReviewUpdateRequest update)
        {

            string procName = "[dbo].[Reviews_Update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {

                    AddCommonParams(update, col, userId);
                    col.AddWithValue("@Id", update.Id);

                },
                returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Reviews_Delete_ById]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@Id", id);
                });
        }

        private void AddCommonParams(ReviewAddRequest request, SqlParameterCollection col, int userId)
        {
            col.AddWithValue("@Subject", request.Subject);
            col.AddWithValue("@Text", request.Text);
            col.AddWithValue("@EntityId", request.EntityId);
            col.AddWithValue("@CreatedBy", userId);
        }

        public Review MapSingleReview(IDataReader reader, ref int startingIndex)
        {
            Review review = new Review();

            review.Id = reader.GetSafeInt32(startingIndex++);
            review.Subject = reader.GetSafeString(startingIndex++);
            review.Text = reader.GetSafeString(startingIndex++);
            review.EntityId = reader.GetSafeInt32(startingIndex++);
            review.DateCreated = reader.GetSafeDateTime(startingIndex++);
            review.DateModified = reader.GetSafeDateTime(startingIndex++);
            review.IsDeleted = reader.GetSafeBool(startingIndex++);
            review.User = _userMapper.MapUser(reader, ref startingIndex);
            
            return review;
        }


    }
}
