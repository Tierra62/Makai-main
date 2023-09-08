using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Services.Interfaces;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using Sabio.Models.Domain.Products;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/cart")]
    [ApiController]
    public class StripeCartApiController : BaseApiController
    {
        private IStripeCartService _service = null;
        private IAuthenticationService<int> _authService = null;

        public StripeCartApiController(IStripeCartService service
         , ILogger<StripeCartApiController> logger
        , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }
        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Product>> GetByProductId(int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                Product product = _service.GetProductById(id);

                if (product == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not found.");
                }
                else
                {
                    response = new ItemResponse<Product>() { Item = product };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: ${ex.Message}");
            }
            return StatusCode(iCode, response);
        }
    }
}
