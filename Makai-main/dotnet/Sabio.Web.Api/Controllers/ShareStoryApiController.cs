using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Models.Requests;
using Sabio.Web.Models.Responses;
using System;
using Sabio.Models.Domain.ShareStory;
using Sabio.Models;
using Sabio.Models.Requests.ShareStory;
using Sabio.Services;


namespace Sabio.Web.Api.Controllers
{
    [Route("api/sharestory")]
    [ApiController]
    public class ShareStoryApiController : BaseApiController
    {
        private IShareStoryService _service;
        private IAuthenticationService<int> _authService;
        public ShareStoryApiController(IShareStoryService storyService, ILogger<ShareStoryApiController> logger, IAuthenticationService<int> authService) : base(logger)
        {
            _service = storyService;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(ShareStoryAddRequest model)
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

        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<ShareStory>> Get(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                ShareStory story = _service.Get(id);

                if (story == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<ShareStory> { Item = story };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: ${ex.Message}");
            }

            return StatusCode(code, response);
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Paged<ShareStory>>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<ShareStory> page = _service.GetAll(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<ShareStory>> { Item = page };
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

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(ShareStoryUpdateRequest model)
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

        [HttpPut("approval/{id:int}")]
        public ActionResult<SuccessResponse> Approval(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.UpdateApproval(id, userId);
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
    }
}
