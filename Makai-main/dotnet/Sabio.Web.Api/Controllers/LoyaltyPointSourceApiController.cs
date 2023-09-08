using Amazon.Runtime.Internal.Util;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain.LoyaltyPoints;
using Sabio.Models;
using Sabio.Models.Requests.LoyaltyPoints;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/loyaltypointssource")]
    [ApiController]
    public class LoyaltyPointSourceApiController : BaseApiController
    {
        private ILoyaltyPointSourceService _service = null;
        private IAuthenticationService<int> _authService = null;

        public LoyaltyPointSourceApiController(ILoyaltyPointSourceService service
            , ILogger<LoyaltyPointSourceApiController> logger
            , IAuthenticationService<int> authService) :base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<LoyaltyPointSource>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                LoyaltyPointSource loyaltyPointSource = _service.GetById(id);
                if (loyaltyPointSource == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<LoyaltyPointSource>() { Item = loyaltyPointSource };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("")]
        public ActionResult<ItemResponse<Paged<LoyaltyPointSource>>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<LoyaltyPointSource> page = _service.GetAll(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<LoyaltyPointSource>>() { Item = page };
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

        [HttpPost("new")]
        public ActionResult<ItemResponse<int>> Create(LoyaltyPointSourceAddRequest loyaltyPointSourceAddModel)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(loyaltyPointSourceAddModel, userId);
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

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(LoyaltyPointSourceUpdateRequest loyaltyPointSourceUpdateRequest)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(loyaltyPointSourceUpdateRequest, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }

        [HttpDelete("{id:int}/delete")]
        public ActionResult<SuccessResponse> UpdateIsDeleted(int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.UpdateIsDeleted( id, userId);
                response = new SuccessResponse();
            }
            catch(Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);

            }
            return StatusCode(iCode, response);
        }

        [HttpPut("{id:int}/expire")]
        public ActionResult<SuccessResponse> UpdateIsExpired(int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.UpdateIsExpired(id, userId);
                response = new SuccessResponse();
            }
            catch(Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }

    }
}
