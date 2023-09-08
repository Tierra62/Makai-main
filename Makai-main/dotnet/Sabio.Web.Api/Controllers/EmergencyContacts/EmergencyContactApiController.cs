using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.EmergencyContacts;
using Sabio.Models.Requests.EmergencyContacts;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers.EmergencyContacts
{
    [Route("api/emergency/contacts")]
    [ApiController]
    public class EmergencyContactApiController : BaseApiController
    {
        private IEmergencyContactService _service = null;
        private IAuthenticationService<int> _authService = null;

        public EmergencyContactApiController(IEmergencyContactService service, ILogger<EmergencyContactApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost("")]
        public ActionResult<ItemResponse<int>> Create(EmergencyContactAddRequest model)
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
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(EmergencyContactUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                 int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpGet("{userId:int}")]
        public ActionResult<ItemsResponse<EmergencyContact>> GetByUserId(int userId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<EmergencyContact> emergencyContact = _service.GetByUserId(userId);

                if (emergencyContact == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found");
                }
                else
                {
                    response = new ItemsResponse<EmergencyContact> { Items = emergencyContact };
                }
            }
            catch(Exception ex)
            {
                iCode= 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }
        [HttpGet("admin")]
        public ActionResult<ItemResponse<Paged<EmergencyContactAdminView>>> GetByUserIdPaginated(int pageIndex, int pageSize, int userId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<EmergencyContactAdminView> page = _service.GetByUserIdPaginated(pageIndex, pageSize, userId);

                if (page == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Users' emergency contacts could not be found");
                }
                else
                {
                    response = new ItemResponse<Paged<EmergencyContactAdminView>>() { Item = page };
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
