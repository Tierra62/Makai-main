using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain.Carts;
using Sabio.Models.Domain.Products;
using Sabio.Models.Requests.Carts;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/shoppingcart")]
    [ApiController]
    public class CartApiController : BaseApiController
    {
        private ICartService _service = null;
        private IAuthenticationService<int> _authService = null;

        public CartApiController(ICartService service
            , ILogger<CartApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

    #region --> GETS <--

        [HttpGet]
        public ActionResult<ItemsResponse<Cart>> GetCartByCurrentUser()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
               int userId = _authService.GetCurrentUserId();

                List<Cart> list = _service.GetCartByCurrentUser(userId);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found")
    ;
                }
                else
                {
                    response = new ItemsResponse<Cart> { Items = list };
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


    #region --> CREATE / UPDATE / DELETE <--

        [HttpPost]
        public ActionResult<ItemResponse<int>> CreateCart(CartAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.AddCart(model, userId);

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

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> UpdateCart(CartUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                _service.UpdateCart(model, userId);

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

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> DeleteCart(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                _service.DeleteCart(id, userId);

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

        #endregion

    }
}
