using Amazon.Runtime.Internal.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Recommendations;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Recommendations;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Sabio.Web.Api.Controllers.Recommendations
{
    [Route("api/recommendations")]
    [ApiController]
    public class RecommendationApiController : BaseApiController
    {
        private IRecommendationService _service = null;
        private IAuthenticationService<int> _authService = null;

        public RecommendationApiController(IRecommendationService service, ILogger<RecommendationApiController> logger, IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Recommendation>>> GetPaginated (int pageIndex, int pageSize)
        {
            int iCode = 200;
            ActionResult result = null;
            
            try
            {
                Paged<Recommendation> paged = _service.Pagination(pageIndex, pageSize);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records not found"));
                } else
                {
                    ItemResponse<Paged<Recommendation>> response = new ItemResponse<Paged<Recommendation>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                ErrorResponse response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, result);
        }

        [HttpPost]
        public ActionResult Create(RecommendationAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                IUserAuthData user = _authService.GetCurrentUser();
                int id = _service.Add(model, user.Id);
                ItemResponse<int> response = new ItemResponse<int> { Item = id };
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

        [HttpGet("{partnerid:int}")]
        public ActionResult<ItemsResponse<Recommendation>> GetByPartnerId(int partnerId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<Recommendation> list = _service.GetByPartnerId(partnerId);
                if (list == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not found");
                }
                else
                {
                    response = new ItemsResponse<Recommendation> { Items = list };
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

        [HttpPut("{id:int}/active")]
        public ActionResult<SuccessResponse> UpdateIsActive(bool isActive, int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.UpdateIsActive(isActive, id, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }
        [HttpPut("{id:int}/delete")]
        public ActionResult<SuccessResponse> UpdateIsDeleted(bool isDeleted, int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.UpdateIsDeleted(isDeleted, id, userId);
                response = new SuccessResponse();
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
