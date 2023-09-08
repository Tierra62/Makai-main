using Amazon.Runtime.Internal.Util;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.LoyaltyPoints;
using Sabio.Models.Requests.LoyaltyPoints;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/loyaltypoints")]
    [ApiController]
    public class LoyaltyPointApiController : BaseApiController
    {
        private ILoyaltyPointService _service = null;
        private IAuthenticationService<int> _authService = null;

        public LoyaltyPointApiController(ILoyaltyPointService service
            , ILogger<LoyaltyPointApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost("")]
        public ActionResult<ItemResponse<int>> Create(LoyaltyPointAddRequest loyaltyPointsAddModel)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(loyaltyPointsAddModel, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch(Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpGet("current")]
        public ActionResult<ItemResponse<Paged<LoyaltyPoint>>> GetByUserIdPaginated(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<LoyaltyPoint> page = _service.GetByUserId(pageIndex, pageSize, userId);

                if(page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<LoyaltyPoint>>() { Item = page };
                }
            }
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("current/total")]
        public ActionResult<ItemResponse<LoyaltyPointsTotal>> GetByUserId_RunningTotal()
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                LoyaltyPointsTotal loyaltyPointsTotal = _service.GetByUserId_RunningTotal(userId);
                if (loyaltyPointsTotal == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemResponse<LoyaltyPointsTotal> { Item = loyaltyPointsTotal };
                }
                
            }
            catch(Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }


    }
}
