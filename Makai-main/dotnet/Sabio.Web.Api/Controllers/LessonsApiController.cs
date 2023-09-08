using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Lessons;
using Sabio.Models.Requests.Lessons;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq.Expressions;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/lessons")]
    [ApiController]
    public class LessonApiController : BaseApiController
    {
        private ILessonService _service = null;
        IAuthenticationService<int> _authService = null;

        public LessonApiController(ILessonService service,
            ILogger<LessonApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }


        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Lesson>>> GetAllPaginated(int pageIndex, int pageSize)
        {
            ActionResult result = null;

            try
            {
                Paged<Lesson> paged = _service.GetAllPaginated(pageIndex, pageSize);

                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records not found"));
                }
                else
                {
                    ItemResponse<Paged<Lesson>> response = new ItemResponse<Paged<Lesson>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }

            return result;
            
        }

        [HttpGet("paginate/{siteTrainingId:int}")]
        public ActionResult<ItemResponse<Paged<Lesson>>> GetBySiteIdPaginated(int pageIndex, int pageSize, int siteTrainingId)   
        {
            ActionResult result = null;

            try
            {
                Paged<Lesson> paged = _service.GetBySiteIdPaginated(pageSize,pageIndex, siteTrainingId);

                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records not found"));
                }
                else
                {
                    ItemResponse<Paged<Lesson>> response = new ItemResponse<Paged<Lesson>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }

            return result;

        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Lesson>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Lesson lesson = _service.GetById(id);

                if (lesson == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Not Found");
                }
                else
                {
                    response = new ItemResponse<Lesson> { Item = lesson };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse($"SqlException Error: {ex.Message}");
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
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpPost("")]
        public ActionResult<ItemResponse<int>> Add(LessonAddRequest model)
        {
            int userId = _authService.GetCurrentUserId();

            ObjectResult result = null;

            try
            {
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
        public ActionResult<SuccessResponse> Update(LessonUpdateRequest model)
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

    }
}
