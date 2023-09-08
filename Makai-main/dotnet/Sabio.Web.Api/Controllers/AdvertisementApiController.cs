using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using Sabio.Services.Interfaces;
using Sabio.Models.Domain.Advertisements;
using Sabio.Models.Requests.Advertisements;
using Amazon.S3.Model;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/advertisements")]
    [ApiController]
    public class AdvertisementApiController : BaseApiController
    {
        private IAdvertisementService _service = null;
        private IAuthenticationService<int> _authService = null;

        public AdvertisementApiController(IAdvertisementService service,
            ILogger<AdvertisementApiController> logger, 
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }
        [HttpGet]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Paged<Advertisement>>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<Advertisement> page = _service.GetAll(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Advertisement>> { Item = page };
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

        [HttpGet("owner/{ownerId:int}")]
        public ActionResult<ItemResponse<Paged<Advertisement>>> GetByCreatedBy(int pageIndex, int pageSize, int OwnerId)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<Advertisement> page = _service.GetByCreatedBy(pageIndex, pageSize, OwnerId);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Advertisement>> { Item = page };
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

        [HttpPost]
        public ActionResult<ItemResponse<int>> CreateAdvertisement(AdvertisementAddRequest model)
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
                Logger.LogError(ex.ToString(), ex);
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpDelete("delete/{id:int}")]
        public ActionResult<SuccessResponse> DeleteAdvertisement(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.DeleteAdvertisement(id);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> UpdateAdvertisement(AdvertisementUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.UpdateAdvertisement(model, userId);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

    }
}
