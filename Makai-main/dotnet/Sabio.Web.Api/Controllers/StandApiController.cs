using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Stands;
using Sabio.Models.Requests.Stands;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.CodeDom.Compiler;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/stands")]
    [ApiController]
    public class StandApiController : BaseApiController
    {
        private IStandService _service = null;
        private IAuthenticationService<int> _authService = null;

        public StandApiController(IStandService service
            ,ILogger<StandApiController> logger
            ,IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        #region - ADD/UPDATE/DELETE -
        [HttpPost]
        public ActionResult<ItemResponse<int>> Add(StandAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);
                ItemResponse<int> response = new ItemResponse<int> { Item = id };
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
        public ActionResult<SuccessResponse> Update(StandUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(iCode, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult Delete(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch (Exception e)
            {
                iCode = 500;
                response = new ErrorResponse(e.Message);
            }
            return StatusCode(iCode, response);
        }
        #endregion

        #region - GETS -
        [HttpGet("user/{userId:int}")]
        public ActionResult<ItemResponse<List<StandDetails>>> GetByUSerId(int userId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<StandDetails> list = _service.GetByUserId(userId);
                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Records not found");
                }
                else
                {
                    response = new ItemResponse<List<StandDetails>> { Item = list };
                }
            }
            catch (Exception e)
            {
                iCode = 500;
                response = new ErrorResponse(e.Message);
                base.Logger.LogError(e.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpPost("geo")]
        public ActionResult<ItemResponse<Paged<StandDetails>>> GetByGeo(StandGeoRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<StandDetails> paged = _service.GetByGeo(model);
                if (paged == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Records not found");
                }
                else
                {
                    response = new ItemResponse<Paged<StandDetails>> { Item = paged };
                }
            }
            catch (Exception e)
            {
                iCode = 500;
                response = new ErrorResponse(e.Message);
                base.Logger.LogError(e.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("reservation")]
        public ActionResult<ItemsResponse<StandDetails>> GetAllV2()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<StandDetails> list = _service.GetAllV2();
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Stands not found.");
                }
                else
                {
                    response = new ItemsResponse<StandDetails>() { Items = list };
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
        [AllowAnonymous]
        public ActionResult<ItemResponse<List<StandDetails>>> GetAll()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<StandDetails> list = _service.GetAll();
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Stands not found.");
                }
                else
                {
                    response = new ItemResponse<List<StandDetails>>() { Item = list };
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
    }
}
