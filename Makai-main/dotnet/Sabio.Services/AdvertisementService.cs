using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain.Advertisements;
using Sabio.Models.Requests.Advertisements;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Sabio.Services
{
    public class AdvertisementService : IAdvertisementService
    {
        IDataProvider _data = null;
        public AdvertisementService(IDataProvider data)
        {
            _data = data;
        }
        public void UpdateAdvertisement(AdvertisementUpdateRequest model, int ownerId)
        {
            string procName = "[dbo].[Advertisements_Update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);
                    col.AddWithValue("@OwnerId", ownerId);
                    col.AddWithValue("@Id", model.Id);

                },
                returnParameters: null);
        }
        public int Add(AdvertisementAddRequest model, int ownerId)
        {
            int id = 0;
            string procName = "[dbo].[Advertisements_Insert]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);
                    col.AddWithValue("@OwnerId", ownerId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;
                    Int32.TryParse(oId.ToString(), out id);
                });
            return id;
        }
        public Paged<Advertisement> GetByCreatedBy(int pageIndex, int pageSize, int ownerId)
        {
            Paged<Advertisement> pagedList = null;
            List<Advertisement> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Advertisements_Select_ByCreatedBy]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@OwnerId", ownerId);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Advertisement advertisement = SingleAdvertisementMapper(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<Advertisement>();
                }
                list.Add(advertisement);
            }
             );
            if (list != null)
            {
                pagedList = new Paged<Advertisement>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public Paged<Advertisement> GetAll(int pageIndex, int pageSize)
        {
            Paged<Advertisement> pagedList = null;
            List<Advertisement> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Advertisements_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Advertisement advertisement = SingleAdvertisementMapper(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<Advertisement>(pageSize);
                }
                list.Add(advertisement);
            }
            );
            if (list != null)
            {
                pagedList = new Paged<Advertisement>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public void DeleteAdvertisement(int Id)
        {
            string procName = "[dbo].[Advertisements_Delete_ById]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", Id);
                },
                returnParameters: null);
        }
        private static Advertisement SingleAdvertisementMapper(IDataReader reader, ref int startingIndex)
        {
            Advertisement advertisement = new Advertisement();
            ProductInfo product = new ProductInfo();
            advertisement.Product = product;
            UserInfo user = new UserInfo();
            advertisement.User = user;

            advertisement.Id = reader.GetSafeInt32(startingIndex++);
            advertisement.ProductId = reader.GetSafeInt32(startingIndex++);
            product.Id = reader.GetSafeInt32(startingIndex++);
            product.Name = reader.GetSafeString(startingIndex++);
            product.ProductTypeId = reader.GetSafeInt32(startingIndex++);
            product.Description = reader.GetSafeString(startingIndex++);
            product.Position = reader.GetSafeString(startingIndex++);
            product.StatusType = reader.GetSafeInt32(startingIndex++);
            product.HourlyPriceInCents = reader.GetSafeInt32(startingIndex++);
            advertisement.OwnerId = reader.GetSafeInt32(startingIndex++);
            user.Id = reader.GetSafeInt32(startingIndex++);
            user.FirstName = reader.GetSafeString(startingIndex++);
            user.LastName = reader.GetSafeString(startingIndex++);
            user.Mi = reader.GetSafeString(startingIndex++);
            user.AvatarUrl = reader.GetSafeString(startingIndex++);
            advertisement.Title = reader.GetSafeString(startingIndex++);
            advertisement.AdMainImage = reader.GetSafeString(startingIndex++);
            advertisement.Details = reader.GetSafeString(startingIndex++);
            advertisement.DateStart = reader.GetSafeDateTime(startingIndex++);
            advertisement.DateEnd = reader.GetSafeDateTime(startingIndex++);
            return advertisement;
        }
        private static void AddCommonParams(AdvertisementAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@ProductId", model.ProductId);
            col.AddWithValue("@Title", model.Title);
            col.AddWithValue("@AdMainImage", model.AdMainImage);
            col.AddWithValue("@Details", model.Details);
            col.AddWithValue("@DateStart", model.DateStart);
            col.AddWithValue("@DateEnd", model.DateEnd);

        }
    }
}
