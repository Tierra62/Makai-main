using Microsoft.AspNetCore.Mvc;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Products;
using Sabio.Models.Requests.Products;
using Sabio.Services.Interfaces;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Drawing.Printing;
using System.Runtime.CompilerServices;

namespace Sabio.Services
{
    public class ProductService : IProductService
    {
        IDataProvider _data = null;
        ILookUpService _lookUpService = null;
        public ProductService(IDataProvider data, ILookUpService lookUpService)
        {
            _data = data;
            _lookUpService = lookUpService;
        }

        #region - GETS - OK
        public Paged<Product> GetByProductTypePaginated(int pageIndex, int pageSize, int? userId)
        {
            string procName = "[dbo].[Products_Select_ByProductType_Paginated]";
            Paged<Product> pagedProduct = null;
            List<Product> list = null;
            int totalCount = 0;
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@UserId", userId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Product aProduct = MapAllProducts(reader, ref startingIndex);
                
                if (totalCount== 0)
                {
                totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Product>();
                }
                list.Add(aProduct);
            });
                if (list != null)
                {
                    pagedProduct = new Paged<Product>(list, pageIndex, pageSize, totalCount);
                }
            return pagedProduct;
        }

        public List<Product> GetByStandId(int standId)
        {
            string procName = "[dbo].[Products_Select_ByStandId]";
            List<Product> list = null;
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@StandId", standId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Product aProduct = MapAllProducts(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<Product>();
                }
                list.Add(aProduct);
            });
            return list;
        }


        public Paged<Product> GetByProductTypeIdAndStandId(int pageIndex, int pageSize, int? productTypeId, int? standId, int? userId)
        {
            string procName = "[dbo].[Products_Select_ByProductTypeAndStandId_Paginated]";
            Paged<Product> pagedProduct = null;
            List<Product> list = null;
            int totalCount = 0;
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@ProductTypeId", productTypeId);
                col.AddWithValue("@StandId", standId);
                col.AddWithValue("@UserId", userId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Product aProduct = MapAllProducts(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Product>();
                }
                list.Add(aProduct);
            });
            if (list != null)
            {
                pagedProduct = new Paged<Product>(list, pageIndex, pageSize, totalCount);
            }
            return pagedProduct;
        }

        public Paged<Product> GetByProductTypeIdAndMultipleStandIds(int[] standId, int pageIndex, int pageSize, int? productTypeId, int? userId)
        {
            string procName = "[dbo].[Products_Select_ByProductTypeAndSeveralStandId_Paginated]";
            Paged<Product> pagedProduct = null;
            List<Product> list = null;
            DataTable standIds = MapIntToTable(standId);
            int totalCount = 0;
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@StandIds", standIds);
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@ProductTypeId", productTypeId);
                col.AddWithValue("@UserId", userId);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Product aProduct = MapAllProducts(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Product>();
                }
                list.Add(aProduct);
            });
            if (list != null)
            {
                pagedProduct = new Paged<Product>(list, pageIndex, pageSize, totalCount);
            }
            return pagedProduct;
        }

        public List<Product> GetAll()
        {
            string procName = "[dbo].[Products_SelectAll]";
            List<Product> list = null;
            _data.ExecuteCmd(procName, inputParamMapper: null
            , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Product aProduct = MapSingleProduct(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<Product>();
                }
                list.Add(aProduct);
            });
            return list;
        }

        public List<Product> GetAllFave(int userId)
        {
            string procName = "[dbo].[ProductsFavorites_SelectAll]";
            List<Product> list = null;
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("UserId", userId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Product aProduct = MapSingleProduct(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<Product>();
                }
                list.Add(aProduct);
            }); 
            return list;
        }

        public Paged<Product> Search(int pageIndex, int pageSize, string query, int? userId)
        {
            string procName = "[dbo].[Products_Search]";
            Paged<Product> pagedProduct = null;
            List<Product> list = null;
            int totalCount = 0;
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@Query", query);
                col.AddWithValue("@UserId", userId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Product aProduct = MapAllProducts(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Product>();
                }
                list.Add(aProduct);
            });
                if (list != null)
                {
                    pagedProduct = new Paged<Product>(list, pageIndex, pageSize, totalCount);
                }
            return pagedProduct;
        }

        public Paged<Product> GetFavePag(int pageIndex, int pageSize, int? userId)
        {
            string procName = "[dbo].[ProductsFavorites_SelectAll_Paginated]";
            Paged<Product> pagedProduct = null;
            List<Product> list = null;
            int totalCount = 0;
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@UserId", userId);
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Product aProduct = MapAllProducts(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Product>();
                }
                list.Add(aProduct);
            });
                if (list != null)
                {
                    pagedProduct = new Paged<Product>(list, pageIndex, pageSize, totalCount);
                }
            return pagedProduct;
        }

        public Paged<Product> Paginated(int pageIndex, int pageSize, int? userId)
        {
            string procName = "[dbo].[Products_SelectAll_WithFavs]";
            Paged<Product> pagedProduct = null;
            List<Product> list = null;
            int totalCount = 0;
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@UserId", userId);
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Product aProduct = MapAllProducts(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Product>();
                }
                list.Add(aProduct);
                if (list != null)
                {
                    pagedProduct = new Paged<Product>(list, pageIndex, pageSize, totalCount);
                }
            });
            return pagedProduct;
        }
        #endregion

        #region - ADD/UPDATE/DELETE - 
        public int Add(ProductAddRequest request, int userId)
        {
            DataTable productImagesTable = null;

            if (request.ImageIds != null)
            {
                productImagesTable = MapIntToTable(request.ImageIds);
            }
            int id = 0;
            string procName = "[dbo].[Products_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(request, col, userId);
                col.AddWithValue("@BatchImages", productImagesTable);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCol)
            {
                object oId = returnCol["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }

        public void Update(ProductUpdateRequest request, int userId)
        {

            DataTable productImagesTable = null;

            if (request.ImageIds != null)
            {
                productImagesTable = MapIntToTable(request.ImageIds);
            }
            string procName = "[dbo].[Products_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(request, col, userId);
                col.AddWithValue("@BatchImages", productImagesTable);
                col.AddWithValue("@Id", request.Id);
            }, returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Products_Delete]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            }, returnParameters: null);
        } 

        public void AddFavorite(int productId, int userId)
        {
            string procName = "[dbo].[ProductsFavorites_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@ProductId", productId);
                col.AddWithValue("@UserId", userId);
            }, returnParameters: null);
        }

        public void DeleteFavorite(int productId, int userId)
        {
            string procName = "[dbo].[ProductsFavorites_Delete]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@ProductId", productId);
                col.AddWithValue("@UserId", userId);
            }, returnParameters: null);
        }
        #endregion

        #region - PRIVATE METHODS - 
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

        private Product MapAllProducts(IDataReader reader, ref int startingIndex)
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
            aProduct.isFavorite = reader.GetSafeBool(startingIndex++);

            return aProduct;
        }


        private DataTable MapIntToTable(IEnumerable<int> ints)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("Id", typeof(int));

            foreach (int num in ints)
            {
                DataRow dr = dt.NewRow();
                int startingIndex = 0;
                dr.SetField(startingIndex++, num);
                dt.Rows.Add(dr);
            }
            return dt;
        }


        private static void AddCommonParams(ProductAddRequest request, SqlParameterCollection col, int userId)
        {
            col.AddWithValue("@Name", request.Name);
            col.AddWithValue("@ProductTypeId", request.ProductTypeId);
            col.AddWithValue("@Description", request.Description);
            col.AddWithValue("@StandId", request.StandId);
            col.AddWithValue("@Identifier", request.Identifier);
            col.AddWithValue("@StatusType", request.StatusType);
            col.AddWithValue("@HourlyPriceInCents", request.HourlyPriceInCents);
            col.AddWithValue("@Position", request.Position);
            col.AddWithValue("@CreatedBy", userId);
            col.AddWithValue("@ModifiedBy", userId);
        } 
        #endregion
    }
}
