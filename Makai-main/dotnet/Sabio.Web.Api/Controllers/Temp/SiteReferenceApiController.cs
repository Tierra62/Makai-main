using Microsoft.Extensions.Logging;
using Sabio.Services.Interfaces;
using Sabio.Services;
using Sabio.Web.Controllers;
using Microsoft.AspNetCore.Mvc;
using Sabio.Web.Models.Responses;
using System;
using Sabio.Models.Requests.SiteReferences;
using Sabio.Models;
using Sabio.Models.Domain.SiteReferences;
using Stripe;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace Sabio.Web.Api.Controllers.Temp
{
    [Route("api/sitereferences")]
    [ApiController]
    public class SiteReferenceApiController : BaseApiController
    {
        private ISiteReferenceService _service = null;
        private IAuthenticationService<int> _authService = null;
        public SiteReferenceApiController(ISiteReferenceService service
            , ILogger<SiteReferenceApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult<ItemResponse<int>> Add(SiteReferenceAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int id = _service.Add(model);
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

        [HttpGet]
        public ActionResult<ItemResponse<Paged<SiteReference>>> GetPaginated(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<SiteReference> paged = _service.GetPaginated(pageIndex, pageSize);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<SiteReference>> response = new ItemResponse<Paged<SiteReference>>();
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

        [HttpGet("chartdata")]
        public ActionResult<ItemsResponse<SiteReferenceChart>> GetAllChart()
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<SiteReferenceChart> siteRef = _service.GetAllChart();

                if (siteRef == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("app no here");
                }
                else
                {
                    response = new ItemsResponse<SiteReferenceChart>() { Items = siteRef };
                }
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
