using Microsoft.AspNetCore.Mvc;
using Sabio.Models;
using Sabio.Models.Domain.Products;
using Sabio.Models.Requests.Products;
using Sabio.Web.Models.Responses;
using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace Sabio.Services.Interfaces
{
    public interface IProductService
    {
        Paged<Product> GetByProductTypePaginated(int pageIndex, int pageSize, int? userId);
        List<Product> GetByStandId(int standId);
        Paged<Product> GetByProductTypeIdAndStandId(int pageIndex, int pageSize, int? productTypeId, int? standId, int? userId);
        Paged<Product> GetByProductTypeIdAndMultipleStandIds(int[] standId, int pageIndex, int pageSize, int? productTypeId, int? userId);
        List<Product> GetAll();
        List<Product> GetAllFave(int userId);
        Paged<Product> Paginated(int pageIndex, int pageSize, int? userId);
        Paged<Product> Search(int pageIndex, int pageSize, string query, int? userId);
        Paged<Product> GetFavePag(int pageIndex, int pageSize, int? userId);
        int Add(ProductAddRequest request, int userId);
        void AddFavorite(int productId, int userId);
        void Update(ProductUpdateRequest request, int userId);
        void Delete(int userId);
        void DeleteFavorite(int productId, int userId);

    }
}