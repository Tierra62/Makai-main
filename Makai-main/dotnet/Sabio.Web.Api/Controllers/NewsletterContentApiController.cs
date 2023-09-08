using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Services.Interfaces;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Models.Requests.Newsletter;
using Sabio.Web.Models.Responses;
using System;
using System.Data.SqlClient;
using Sabio.Models.Domain.Newsletters;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/newsletter/content")]
    [ApiController]
    public class NewsletterContentApiController : BaseApiController
    {

            private INewsletterContentService _service = null;
            private IAuthenticationService<int> _authService = null;

            public NewsletterContentApiController(INewsletterContentService service,
                ILogger<NewsletterContentApiController> logger,
                IAuthenticationService<int> authService) : base(logger)
            {
                _service = service;
                _authService = authService;
            }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(NewsletterContentAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);
                ItemResponse<int> response = new ItemResponse<int> { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                int iCode = 500;
                ErrorResponse response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.ToString());
                result = StatusCode(iCode, response);
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(NewsletterContentUpdateRequest model)
        {
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);
                SuccessResponse response = new SuccessResponse();
                return Ok(response);
            }
            catch (Exception ex)
            {
                ErrorResponse response = new ErrorResponse(ex.Message);
                return StatusCode(500, response);
            }
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<NewsletterContent>> GetByNewsletterId(int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                List<NewsletterContent> aNewsletterContent = _service.GetByNewsletterId(id);
                if (aNewsletterContent == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Newsletter Content Not Found.");
                }
                else
                    response = new ItemResponse<List<NewsletterContent>> { Item = aNewsletterContent };
            }
            catch (SqlException sqlEx)
            {
                iCode = 500;
                response = new ErrorResponse($"SqlException Error: {sqlEx.Message}");
                base.Logger.LogError(sqlEx.ToString());
            }

            catch (ArgumentException argEx)
            {
                iCode = 500;
                response = new ErrorResponse($"ArgumentException Error: {argEx.Message}");

            }

            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
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
                _service.DeleteById(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

    }
}
