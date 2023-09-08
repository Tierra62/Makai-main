using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain.Blogs;
using Sabio.Models.Requests.Blogs;
using Sabio.Models;
using Sabio.Services;
using Sabio.Web.Models.Responses;
using System;
using Sabio.Web.Controllers;
using Sabio.Models.Domain.Ratings;
using Sabio.Services.Interfaces;
using Sabio.Models.Requests.Ratings;

namespace Sabio.Web.Api.Controllers
{

    [Route("api/ratings")]
    [ApiController]
    public class RatingApiController : BaseApiController
    {
        private IRatingService _service = null;
        private IAuthenticationService<int> _authService = null;

        public RatingApiController(IRatingService service,
            ILogger<RatingApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }
       

        [HttpGet]
        [AllowAnonymous]
        public ActionResult<ItemResponse<EntityRating>> GetAverage(int ratingEntityTypeId, int ratingEntityId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                EntityRating rating = _service.GetAverage(ratingEntityTypeId, ratingEntityId);

                if (rating == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemResponse<EntityRating> { Item = rating };
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
       
        [HttpGet("paginated")]
        [AllowAnonymous]

        public ActionResult<ItemResponse<Paged<Ratings>>> GetByEntityId(int pageIndex, int pageSize, int entityTypeId, int entityId)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<Ratings> page = _service.GetByEntityId(entityTypeId, entityId, pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Ratings>> { Item = page };
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
        [AllowAnonymous]
        public ActionResult<ItemResponse<int>> Create(RatingAddRequest model)
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

        [HttpPut("delete/{id:int}")]
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

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(RatingUpdateRequest model)
        {
            int userId = _authService.GetCurrentUserId();
            int code = 200;
            BaseResponse response = null;
            try
            {

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
    }
}

