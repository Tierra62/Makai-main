using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Services.Interfaces;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Models.Requests.Newsletter;
using Sabio.Web.Models.Responses;
using System;
using Sabio.Models.Domain.Newsletters;
using Sabio.Models;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/newsletter/templates")]
    [ApiController]
    public class NewsletterTemplateApiController : BaseApiController
    {
        private INewsletterTemplateService _service = null;
        private IAuthenticationService<int> _authService = null;

        public NewsletterTemplateApiController(INewsletterTemplateService service,
            ILogger<NewsletterTemplateApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(NewsletterTemplateAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.AddNewsletterTemplate(model, userId);
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

        [HttpGet]
        public ActionResult<ItemResponse<Paged<NewsletterTemplate>>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<NewsletterTemplate> page = _service.GetAll(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Newsletter Template data was not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<NewsletterTemplate>> { Item = page };
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

        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(NewsletterTemplateUpdateRequest model)
        {

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.UpdateNewsletterTemplate(model, userId);
                SuccessResponse response = new SuccessResponse();
                return Ok(response);
            }
            catch (Exception ex)
            {
                ErrorResponse response = new ErrorResponse(ex.Message);
                return StatusCode(500, response);
            }
        }

    }
}
