using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Services.Interfaces;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Models.Requests.Stripe;
using Sabio.Web.Models.Responses;
using System;
using Sabio.Models.Domain.Stripe;
using Sabio.Models;
using Stripe;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/stripe/receipts")]
    [ApiController]
    public class StripeOrderReceiptApiController : BaseApiController
    {
        private IStripeOrderReceiptService _service = null;
        private IAuthenticationService<int> _authService = null;
        public StripeOrderReceiptApiController(IStripeOrderReceiptService service
         , ILogger<StripeOrderReceiptApiController> logger
        , IAuthenticationService<int> authService) : base(logger)

        {
            _service = service;
            _authService = authService;
        }
        [HttpPost]
        public ActionResult<ItemResponse<int>> Add(OrderReceiptRequest aOrder)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.AddOrder(aOrder, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                ErrorResponse response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
                result = StatusCode(500, response);
            }
            return result;
        }
        [HttpGet]
        public ActionResult<ItemsResponse<OrderReceipt>> GellAll()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<OrderReceipt> list = _service.GetAll();

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemsResponse<OrderReceipt> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpGet("users/{userId:int}")]
        public ActionResult<ItemResponse<Paged<OrderReceipt>>> GellAllByUserId(int pageIndex, int pageSize, int userId)
        {
            int code = 200;
            BaseResponse response = null;
            
            try
            {
                Paged<OrderReceipt> page = _service.GetAllByUserId(pageIndex, pageSize, userId);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<OrderReceipt>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpGet("{recipient}")]
        public ActionResult<ItemResponse<Paged<OrderReceipt>>> GellAllByRecipient(string recipient, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<OrderReceipt> page = _service.GetAllByRecipient(pageIndex, pageSize, recipient);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<OrderReceipt>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<OrderReceipt>> GetByUserId(int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                OrderReceipt order = _service.GetOrderById(id);

                if (order == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not found.");
                }
                else
                {
                    response = new ItemResponse<OrderReceipt>() { Item = order };
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
