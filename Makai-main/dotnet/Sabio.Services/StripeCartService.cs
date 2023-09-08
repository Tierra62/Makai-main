
using System.Data.SqlClient;
using System.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain.Products;
using Sabio.Data;
using Sabio.Services.Interfaces;

namespace Sabio.Services
{
    public class StripeCartService : IStripeCartService
    {
        public IDataProvider _data = null;
        ILookUpService _lookUpService = null;

        public StripeCartService(IDataProvider data, ILookUpService lookUpService)
        {
            _data = data;
            _lookUpService = lookUpService;
        }

        public Product GetProductById(int id)
        {
            string procName = "[dbo].[Products_SelectById]";
            Product aProduct = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                aProduct = MapSingleProduct(reader, ref startingIndex);
            });
            return aProduct;
        }
        private Product MapSingleProduct(IDataReader reader, ref int startingIndex)
        {
            Product aProduct = new Product();

            aProduct.Id = reader.GetSafeInt32(startingIndex++);
            aProduct.Name = reader.GetSafeString(startingIndex++);
            aProduct.ProductType = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            aProduct.Description = reader.GetSafeString(startingIndex++);
            aProduct.StandId = reader.GetSafeInt32(startingIndex++);
            aProduct.Identifier = reader.GetSafeInt32(startingIndex++);
            aProduct.StatusType = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            aProduct.HourlyPriceInCents = reader.GetSafeInt32(startingIndex++);
            aProduct.Position = reader.GetSafeString(startingIndex++);
            aProduct.CreatedBy = reader.GetSafeInt32(startingIndex++);
            aProduct.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            aProduct.FileId = reader.GetSafeInt32(startingIndex++);
            aProduct.Url = reader.GetSafeString(startingIndex++);
            aProduct.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aProduct.DateModified = reader.GetSafeDateTime(startingIndex++);

            return aProduct;
        }
    }
}