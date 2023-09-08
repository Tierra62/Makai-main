using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Blogs;
using Sabio.Models.Domain.Products;
using Sabio.Models.Requests.Products;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/products")]
    public class ProductApiController : BaseApiController
    {
        private IProductService _service = null;
        private IAuthenticationService<int> _authService = null;
        public ProductApiController(IProductService service
            , ILogger<ProductApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        #region - GETS - 
        [HttpGet("stand/{standId:int}")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Product>> GetByStandId(int standId)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<Product> list = _service.GetByStandId(standId);
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Products not found in stand.");
                }
                else
                {
                    response = new ItemResponse<List<Product>>() { Item = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("type/stand")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Paged<Product>>> GetByProductTypeIdAndStandId(int pageIndex, int pageSize, int? productTypeId, int? standId)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                bool isLoggedIn = _authService.IsLoggedIn();
                int? userId = null;

                if (isLoggedIn)
                {
                    userId = _authService.GetCurrentUserId();
                }

                Paged<Product> page = _service.GetByProductTypeIdAndStandId(pageIndex, pageSize, productTypeId, standId, userId);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Product type Id not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Product>>() { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response );
        }
        [HttpGet("type/stands")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Paged<Product>>> GetByProductTypeIdAndMultipleStandIds([FromQuery] int[] standId, int pageIndex, int pageSize, int? productTypeId)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                bool isLoggedIn = _authService.IsLoggedIn();
                int? userId = null;

                if (isLoggedIn)
                {
                    userId = _authService.GetCurrentUserId();
                }

                Paged<Product> page = _service.GetByProductTypeIdAndMultipleStandIds(standId, pageIndex, pageSize, productTypeId, userId);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Product type Id not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Product>>() { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("type")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Paged<Product>>> Pagination(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                bool isLoggedIn = _authService.IsLoggedIn();
                int? userId = null;

                if (isLoggedIn)
                {
                    userId = _authService.GetCurrentUserId();
                }

                Paged<Product> page = _service.GetByProductTypePaginated(pageIndex, pageSize, userId);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Products not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Product>>() { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet]
        public ActionResult<ItemResponse<List<Product>>> GetAll()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<Product> list = _service.GetAll();
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Products not found.");
                }
                else
                {
                    response = new ItemResponse<List<Product>>() { Item = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("search")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Paged<Product>>> Search(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                bool isLoggedIn = _authService.IsLoggedIn();
                int? userId = null;

                if (isLoggedIn)
                {
                    userId = _authService.GetCurrentUserId();
                }

                Paged<Product> page = _service.Search(pageIndex, pageSize, query, userId);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Product not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Product>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("paginate")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Paged<Product>>> SelectAllPaginated(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                bool isLoggedIn = _authService.IsLoggedIn();
                int? userId = null;
                
                if (isLoggedIn)
                {
                    userId = _authService.GetCurrentUserId();
                }
                Paged<Product> page = _service.Paginated(pageIndex, pageSize, userId);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Products not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Product>>() { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("favorites/all")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<List<Product>>> GetAllFave()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                List<Product> list = _service.GetAllFave(userId);
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Favorite product(s) not found.");
                }
                else
                {
                    response = new ItemResponse<List<Product>>() { Item = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("favorites")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Paged<Product>>> GetAllFavePag(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Product> page = _service.GetFavePag(pageIndex, pageSize, userId);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Favorite products not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Product>>() { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        #endregion

        #region - CREATE / UPDATE / DELETE -
        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(ProductAddRequest request)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(request, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPost("favorites/{productId:int}")]
        public ActionResult<SuccessResponse> CreateFav(int productId)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.AddFavorite(productId, userId);
                response = new SuccessResponse();
                
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(ProductUpdateRequest request)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(request, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpDelete("favorites/{productId:int}")]
        public ActionResult<SuccessResponse> DeleteFav(int productId)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.DeleteFavorite(productId, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
    } 
    #endregion
}
