using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain.InsuranceOptions;
using Sabio.Models.Requests.InsuranceOptions;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/insurance")] // Might need to change
    [ApiController]
    public class InsuranceOptionApiController : BaseApiController
    {
        private IInsuranceOptionService _service;
        private IAuthenticationService<int> _authService;
        public InsuranceOptionApiController(IInsuranceOptionService service,ILogger<InsuranceOptionApiController> logger,IAuthenticationService<int> authService): base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<InsuranceOption>> Get (int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                InsuranceOption option = _service.GetById(id);
                if (option == null)
                {
                    iCode = 404;
                    response = new ErrorResponse($"Insurance Option with Id:{id} Not Found");
                }
                else
                {
                    response = new ItemResponse<InsuranceOption> { Item = option };
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

        [HttpGet]
        public ActionResult<ItemsResponse<InsuranceOption>> GetAll()
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                List<InsuranceOption> list = _service.GetAll();
                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("No Insurance Options Found");
                }
                else
                {
                    response = new ItemsResponse<InsuranceOption> { Items = list };
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

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(InsuranceOptionAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);
                ItemResponse<int> response = new ItemResponse<int> { Item = id };
                result = Created201(response);
            }
            catch(Exception ex)
            {
                int iCode = 500;
                ErrorResponse response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.ToString());
                result = StatusCode(iCode,response);
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult Update(InsuranceOptionUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);
                response = new SuccessResponse();
            }
            catch(Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.ToString());
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
                int userId = _authService.GetCurrentUserId();
                _service.Delete(id, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }
    }
}
