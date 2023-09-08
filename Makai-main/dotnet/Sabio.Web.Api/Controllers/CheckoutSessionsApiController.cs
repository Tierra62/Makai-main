using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain.Stripe;
using Sabio.Models.Requests.Stripe;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using Stripe;
using Stripe.Checkout;
using System;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/checkouts")]
    [ApiController]
    public class CheckoutSessionsApiController : BaseApiController
    {
        private ICheckoutSessionService _service = null;
        private IAuthenticationService<int> _authService = null;
     
        public CheckoutSessionsApiController(ICheckoutSessionService service
         , ILogger<CheckoutSessionsApiController> logger
        , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> CreateSession(SessionAddRequest newSession)
        {
            ObjectResult result = null;
            
            try
            {
                string sessionId = _service.AddSession(newSession);
                ItemResponse<string> response = new ItemResponse<string>() { Item = sessionId };
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
        [HttpPost("success")]
        public ActionResult<ItemResponse<Session>> OrderSuccess(AddSessionDetailsRequest session_id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                Session sessionDetails = _service.GetOrderDetails(session_id);

                if (sessionDetails == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not found.");
                }
                else
                {
                    response = new ItemResponse<Session>() { Item = sessionDetails };
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

        [HttpPost("items")]
        public ActionResult<ItemResponse<StripeList<LineItem>>> LineItems(AddSessionDetailsRequest session_id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                StripeList<LineItem> lineItems = _service.GetListLineItems(session_id);

                if (lineItems == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not found.");
                }
                else
                {
                    response = new ItemResponse<StripeList<LineItem>>() { Item = lineItems };
                }
            }
            catch(Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: ${ex.Message}");
            }
            return StatusCode(iCode, response);  
        }

        [HttpPost("reservation")]
        public ActionResult<ItemResponse<int>> ReservationCreateSession(SessionAddRequest newSession)
        {
            ObjectResult result = null;

            try
            {
                string sessionId = _service.ReservationAddSession(newSession);
                ItemResponse<string> response = new ItemResponse<string>() { Item = sessionId };
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

        [HttpPost("reservation/success")]
        public ActionResult ReservationOrderSuccess(AddSessionDetailsRequest session_id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                Session sessionDetails = _service.GetOrderDetails(session_id);

                if (sessionDetails == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not found.");
                }
                else
                {
                    response = new ItemResponse<Session>() { Item = sessionDetails };
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
