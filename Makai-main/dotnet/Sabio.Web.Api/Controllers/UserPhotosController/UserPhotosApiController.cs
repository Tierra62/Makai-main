using Amazon.Runtime.Internal.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.UserPhotos;
using Sabio.Models.Requests.UserPhotos;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers.UserPhotosController
{
    [Route("api/userphotos")]
    [ApiController]
    public class UserPhotosApiController : BaseApiController
    {
        private IUserPhotosService _service = null;
        private IAuthenticationService<int> _authService = null;

        public UserPhotosApiController(IUserPhotosService service,
            ILogger<UserPhotosApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> DeleteById(int id)
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

        [HttpGet("createdby/{createdby:int}")]
        public ActionResult<ItemsResponse<List<UserPhotos>>> GetByCreatedBy(int CreatedBy)
        {
            int icode = 200;
            BaseResponse response = null;

            try
            {
                List<UserPhotos> list = _service.Get(CreatedBy);

                if (list == null)
                {
                    icode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<UserPhotos> { Items = list };
                }
            }
            catch (Exception ex)
            {
                icode = 500;
                response = new ErrorResponse($"generic error: {ex.Message}");
            }
            return StatusCode(icode, response);
        }

        [HttpGet("paginate")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Paged<UserPhotos>>> GetPaginated(int pageIndex, int pageSize, bool isApproved)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<UserPhotos> userphoto = _service.GetByIsApproved(pageIndex, pageSize, isApproved);
                if (userphoto == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<UserPhotos>> { Item = userphoto };
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


        [HttpGet("unapproved")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Paged<UserPhotos>>> GetNotApprovedPaginated(int pageIndex, int pageSize, bool isApproved)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<UserPhotos> userphoto = _service.GetByNotApproved(pageIndex, pageSize, isApproved);
                if (userphoto == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Resource not found."); 
                }
                else
                {
                    response = new ItemResponse<Paged<UserPhotos>> { Item = userphoto };
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
        public ActionResult<ItemResponse<int>> Create(UserPhotosAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                IUserAuthData userphoto = _authService.GetCurrentUser();

                int id = _service.Add(model, userId);

                ItemResponse<int> response = new ItemResponse<int> { Item = id };

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
        public ActionResult<SuccessResponse> Update(UserPhotosUpdateRequest model)
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

        [HttpPut("approved/{id:int}")]  
        public ActionResult<SuccessResponse> UpdateIsApproved(UserPhotosUpdateIsApprovedRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.UpdateIsApproved(model, userId);
                response = new SuccessResponse();
            }
            catch(Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

    }
}
