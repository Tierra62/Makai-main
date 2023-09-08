using Amazon.Runtime.Internal.Util;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Requests.StandReturns;
using Sabio.Models.Domain.StandReturns;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using Sabio.Models;
using System.Linq.Expressions;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/standreturns")]
    [ApiController]
    public class StandReturnApiController : BaseApiController
    {
        private IStandReturnService _service = null;
        private IAuthenticationService<int> _authService = null;

        public StandReturnApiController(IStandReturnService service
            , ILogger<StandReturnApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Add(StandReturnAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(ImageUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Update(model);

                response = new SuccessResponse();
            }
            catch(Exception ex) 
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("user/{userId:int}/paginate")]
        public ActionResult<ItemResponse<Paged<StandReturnDetails>>> GetByUserId(int userId, int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;

        try
        {
                Paged<StandReturnDetails> paged = _service.GetByUserId(userId, pageIndex, pageSize);
                if(paged == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Records not found");
                }
                else
                {
                    response = new ItemResponse<Paged<StandReturnDetails>> { Item = paged };
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

        [HttpGet("stand/{standId:int}/paginate")]
        public ActionResult<ItemResponse<Paged<StandReturnDetails>>> GetByStandId(int standId, int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<StandReturnDetails> paged = _service.GetByStandId(standId, pageIndex, pageSize);
                if(paged == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Record not found");
                }
                else
                {
                    response = new ItemResponse<Paged<StandReturnDetails>> { Item = paged };
                }
            }
            catch(Exception ex)
                {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("allstandreturns/paginate")]
        public ActionResult<ItemResponse<Paged<StandReturnDetails>>> GetAll(int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<StandReturnDetails> paged = _service.GetAll(pageIndex, pageSize);
                if (paged == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Record not found");
                }
                else
                {
                    response = new ItemResponse<Paged<StandReturnDetails>> { Item = paged };
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

    }
}

