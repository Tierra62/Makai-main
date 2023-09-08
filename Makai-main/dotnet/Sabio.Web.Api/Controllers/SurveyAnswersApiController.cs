using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.SurveyAnswers;
using Sabio.Models.Requests.SurveyAnswers;
using Sabio.Models.Requests.Surveys;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Drawing.Printing;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/surveys/answers")]
    [ApiController]
    public class SurveyAnswersApiController : BaseApiController
    {
        private ISurveyAnswersService _service = null;

        public SurveyAnswersApiController(ISurveyAnswersService service
            , ILogger<SurveyAnswersApiController> logger) : base(logger)
        {
            _service = service;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> AddSurveyAnswer(List<SurveyAnswerAddRequest> models)
        {
            
            ObjectResult result = null;

            try
            {
                int id = _service.Add(models);

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
        public ActionResult<SuccessResponse> UpdateSurveyAnswer(SurveyAnswerUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Update(model);

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
        public ActionResult<SuccessResponse> DeleteSurveyAnswerById(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.DeleteById(id);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        #region GETs
        [HttpGet("{id:int}")]

        public ActionResult<ItemResponse<SurveyAnswer>> GetSurveyAnswerById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                SurveyAnswer surveyAnswer = _service.GetById(id);

                if (surveyAnswer == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<SurveyAnswer> { Item = surveyAnswer };
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

        [HttpGet]
        public ActionResult<ItemResponse<Paged<SurveyAnswer>>> GetAllSurveyAnswers(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<SurveyAnswer> page = _service.GetAllPaginated(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Records not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<SurveyAnswer>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(code, response);
        }

        [HttpGet("createdBy/{userId:int}")]
        public ActionResult<ItemResponse<Paged<SurveyAnswer>>> GetSurveyAnswerByCreatedBy(int pageIndex, int pageSize, int userId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<SurveyAnswer> surveyAnswer = _service.GetByCreatedBy(pageIndex, pageSize, userId);

                if (surveyAnswer == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<SurveyAnswer>> { Item = surveyAnswer };
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

        [HttpGet("instance/{instanceId:int}")]
        public ActionResult<ItemResponse<List<SurveyAnswer>>> GetSurveyAnswerBySurveyInstanceId(int instanceId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<SurveyAnswer> list = _service.GetByInstanceId(instanceId);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Instance Ids not found.");
                }
                else
                {
                    List<SurveyAnswer> paged  = new List<SurveyAnswer>(list);
                    response = new ItemResponse<List<SurveyAnswer>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(code, response);
        }

        [HttpGet("survey/{surveyId:int}")]
        public ActionResult<ItemResponse<Paged<SurveyAnswer>>> GetSurveyAnswerBySurveyId(int pageIndex, int pageSize, int surveyId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<SurveyAnswer> page = _service.GetBySurveyId(pageIndex, pageSize, surveyId);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Record not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<SurveyAnswer>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }
        #endregion

    }

}
