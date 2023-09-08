using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Stripe;
using Sabio.Models.Requests.Stripe;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using Stripe;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/stripe/user")]
    [ApiController]
    public class StripeUserApiController : BaseApiController
    {
        private IStripeUserService _service = null;
        private IAuthenticationService<int> _authService = null;
        public StripeUserApiController(IStripeUserService service
         , ILogger<StripeUserApiController> logger
        , IAuthenticationService<int> authService) : base(logger)

        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Add(StripeUserAddRequest aEvent)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.AddStripeUser(aEvent, userId);
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

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(StripeUserUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.UpdateStripeUser(model, userId);
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

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Event>> GetByUserId(int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                UserStripeAccount user = _service.GetStripeUserById(id);

                if (user == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not found.");
                }
                else
                {
                    response = new ItemResponse<UserStripeAccount>() { Item = user };
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
        [HttpGet]
        public ActionResult<ItemsResponse<UserStripeAccount>> GellAll()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<UserStripeAccount> list = _service.GetAll();

                if (list == null)
                {
                    code = 400;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemsResponse<UserStripeAccount> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = new SuccessResponse();

            try
            {
                _service.Delete(id);
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

    }
}
