using Google.Apis.AnalyticsReporting.v4.Data;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Carts;
using Sabio.Models.Domain.Products;
using Sabio.Models.Requests.Carts;
using Sabio.Services.Interfaces;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Drawing.Text;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class CartService : ICartService

    {
        IDataProvider _data = null;
        ILookUpService _lookUpService = null;


        public CartService(IDataProvider data, ILookUpService lookUpService)
        {
            _data = data;
            _lookUpService = lookUpService;

        }

        public List<Cart> GetCartByCurrentUser(int userId)
        {
            List<Cart> list = null;

            string procName = "[dbo].[Cart_SelectByCurrentV2]";

            _data.ExecuteCmd(

                procName,

                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@userId", userId);
                },

                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;

                    Cart cart = MapSingleCart(reader, ref startingIndex);

                    if (list == null)
                    {

                        list = new List<Cart>();

                    }
                    list.Add(cart);

                }
                );

            return list;

        }

        public int AddCart(CartAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Cart_InsertV3]";
            _data.ExecuteNonQuery(

                procName,

                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    AddCommonParams(model, collection);
                    collection.AddWithValue("@CreatedBy", userId);
                    collection.AddWithValue("@ModifiedBy", userId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;
                    collection.Add(idOut);
                },

                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object objectId = returnCollection["@Id"].Value;
                    int.TryParse(objectId.ToString(), out id);
                }
                );

            return id;

        }

        public void UpdateCart(CartUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Cart_UpdateV2]";
            _data.ExecuteNonQuery(

                procName,

                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    AddCommonParams(model, collection);
                    collection.AddWithValue("@Id", model.Id);
                    collection.AddWithValue("@StartTime", model.StartTime);
                    collection.AddWithValue("@EndTime", model.EndTime);
                    collection.AddWithValue("@ModifiedBy", userId);
                },

                returnParameters: null

                );
        }

        public void DeleteCart(int id, int userId)
        {
            string procName = "[dbo].[Cart_DeleteById]";
            _data.ExecuteNonQuery(

                procName,

                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@Id", id);
                },

                returnParameters: null

                );
        }

        private static void AddCommonParams(CartAddRequest model, SqlParameterCollection collection)
        {
            collection.AddWithValue("@ProductId", model.ProductId);
            collection.AddWithValue("@Quantity", model.Quantity);

        }

        private Cart MapSingleCart(IDataReader reader, ref int startingIndex)
        {
            Cart cart = new Cart();

            cart.Id = reader.GetSafeInt32(startingIndex++);
            cart.Quantity = reader.GetSafeInt32(startingIndex++);
            cart.StartTime = reader.GetSafeDateTime(startingIndex++);
            cart.EndTime = reader.GetSafeDateTime(startingIndex++);
            cart.Product = new Product();
            cart.Product.Id = reader.GetSafeInt32(startingIndex++);
            cart.Product.Name = reader.GetSafeString(startingIndex++);
            cart.Product.ProductType = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            cart.Product.Description = reader.GetSafeString(startingIndex++);
            cart.Product.StandId = reader.GetSafeInt32(startingIndex++);
            cart.Product.Identifier = reader.GetSafeInt32(startingIndex++);
            cart.Product.StatusType = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            cart.Product.HourlyPriceInCents = reader.GetSafeInt32(startingIndex++);
            cart.Product.Position = reader.GetSafeString(startingIndex++);
            cart.Product.CreatedBy = reader.GetSafeInt32(startingIndex++);
            cart.Product.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            cart.Product.FileId = reader.GetSafeInt32(startingIndex++);
            cart.Product.Url = reader.GetSafeString(startingIndex++);
            cart.Product.DateCreated = reader.GetSafeDateTime(startingIndex++);
            cart.Product.DateModified = reader.GetSafeDateTime(startingIndex++);
            cart.CreatedBy = reader.GetSafeInt32(startingIndex++);
            cart.ModifiedBy = reader.GetSafeInt32(startingIndex++);

            return cart;
        }
    }
}
