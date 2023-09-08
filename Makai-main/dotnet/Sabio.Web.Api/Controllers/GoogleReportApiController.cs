using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sabio.Models.Domain.Example;
using Sabio.Models.Requests.GoogleReportRequest;
using Sabio.Web.Models.Responses;
using System.Collections.Generic;
using System;
using Sabio.Web.Controllers;
using Google.Apis.AnalyticsReporting.v4.Data;
using Microsoft.Extensions.Logging;
using Sabio.Services;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/googleanalytics")]
    [ApiController]
    public class GoogleReportApiController : BaseApiController
    {
        private IGoogleAnalyticsReportService _service = null;
        private IAuthenticationService<int> _authService = null;
        public GoogleReportApiController(IGoogleAnalyticsReportService service,
            ILogger<GoogleReportApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost("data")]
        public ActionResult<ItemResponse<GetReportsResponse>> GetReport(GoogleGetReportRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                GetReportsResponse report = _service.GetAnalyticsReport(model);

                if (report == null)
                {
                    code = 404;
                    response = new ErrorResponse("Analytics data not found.");
                }
                else
                {
                    response = new ItemResponse<GetReportsResponse>() { Item = report };
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

    }
}