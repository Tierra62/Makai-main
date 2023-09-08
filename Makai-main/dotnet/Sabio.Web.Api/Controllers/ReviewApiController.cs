using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sabio.Models;
using Sabio.Web.Models.Responses;
using System;
using Microsoft.Extensions.Logging;
using Sabio.Services.Interfaces;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Models.Requests.Reviews;
using Sabio.Models.Domain.Reviews;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/reviews")]
    [ApiController]
    public class ReviewApiController : BaseApiController
    {
        private IReviewService _service = null;
        private IAuthenticationService<int> _authService = null;
        public ReviewApiController(IReviewService service,
                ILogger<ReviewApiController> logger,
                IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(ReviewAddRequest request)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(userId, request);
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

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(ReviewUpdateRequest request)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(userId, request);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Review>> Get(int id)
        {
            {
                int iCode = 200;
                BaseResponse response = null;

                try
                {
                    List<Review> review = _service.Get(id);

                    if (review == null)
                    {
                        iCode = 404;
                        response = new ErrorResponse("Application Resource not found");
                    }
                    else
                    {
                        response = new ItemResponse<List<Review>> { Item = review };
                    }
                }
                catch (Exception ex)
                {
                    iCode = 500;
                    base.Logger.LogError(ex.ToString());
                    response = new ErrorResponse($"Generic Error: {ex.Message}");
                }

                return StatusCode(iCode, response);

            }

        }
    }
}
