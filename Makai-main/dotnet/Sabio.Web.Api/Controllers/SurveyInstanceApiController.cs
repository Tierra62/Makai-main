using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Services.Interfaces;
using Sabio.Services;
using Sabio.Web.Models.Responses;
using Stripe;
using System;
using Sabio.Web.Controllers;
using Sabio.Models.Domain.Surveys;
using Sabio.Models.Domain.SurveyInstances;
using Sabio.Models.Requests.SurveyInstances;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/surveyInstance")]
    [ApiController]
    public class SurveyInstanceApiController : BaseApiController
    {
        private ISurveyInstanceService _service = null;
        private IAuthenticationService<int> _authService = null;
        public SurveyInstanceApiController(ISurveyInstanceService service,
                ILogger<SurveyInstanceApiController> logger,
                IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(SurveyInstanceAddRequest request)
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

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<SurveyInstance>> Get(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                SurveyInstance surveyInstance = _service.Get(id);

                if (surveyInstance == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found");
                }
                else
                {
                    response = new ItemResponse<SurveyInstance> { Item = surveyInstance };
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
