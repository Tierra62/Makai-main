using Sabio.Data.Providers;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using Sabio.Services.Interfaces;
using Sabio.Models.Requests.Stripe;
using Sabio.Models.Domain.Stripe;
using Sabio.Data;
using Sabio.Models;

namespace Sabio.Services
{
    public class StripeUserService : IStripeUserService
    {
        public IDataProvider _data = null;
        public StripeUserService(IDataProvider data)
        {
            _data = data;
        }
        public int AddStripeUser(StripeUserAddRequest user, int userId)
        {
            int id = 0;
            string procName = "[dbo].[UserStripeAccounts_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection data)
            {
                AddCommonParams(user, data);
                data.AddWithValue("@UserId", userId);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                data.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@id"].Value;
                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }

        public void UpdateStripeUser(StripeUserUpdateRequest user, int userId)
        {
            string procName = "[dbo].[UserStripeAccounts_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection data)
            {
                AddCommonParams(user, data);
                data.AddWithValue("@Id", user.Id);
                data.AddWithValue("@UserId", userId);
            }, returnParameters: null);
        }
        public UserStripeAccount GetStripeUserById(int id)
        {
            string procName = "[dbo].[UserStripeAccounts_SelectById]";
            UserStripeAccount user = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@UserId", id);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                user = MapSingleUser(reader, ref startingIndex);
            });
            return user;

        }
        public List<UserStripeAccount> GetAll()
        {
            
            List<UserStripeAccount> result = null;
            string procName = "[dbo].[UserStripeAccounts_SelectAll]";
            UserStripeAccount user = null;

            _data.ExecuteCmd(
                procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {

                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    user = MapSingleUser(reader, ref startingIndex);


                    if (result == null)
                    {
                        result = new List<UserStripeAccount>();
                    }
                    result.Add(user);
                });

            return result;
        }
        public void Delete(int id)
        {
            string procName = "[dbo].[UserStripeAccounts_DeleteById]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, returnParameters: null);
        }

        private static UserStripeAccount MapSingleUser(IDataReader reader, ref int startingIndex)
        {
            UserStripeAccount user = new UserStripeAccount();
            user.Id = reader.GetSafeInt32(startingIndex++);
            user.UserId = reader.GetSafeInt32(startingIndex++);
            user.StripeAccountId = reader.GetSafeString(startingIndex++);
            user.Name = reader.GetSafeString(startingIndex++);
            user.DateCreated = reader.GetSafeDateTime(startingIndex++);
            user.DateModified = reader.GetSafeDateTime(startingIndex++);
            return user;
        }
        private static void AddCommonParams(StripeUserAddRequest user, SqlParameterCollection data)
        {
            data.AddWithValue("@StripeAccountId", user.StripeAccountId);
            data.AddWithValue("@Name", user.Name);
        }
    }
}
