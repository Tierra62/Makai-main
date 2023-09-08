using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain;
using Sabio.Models;
using Sabio.Models.Interfaces;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using Sabio.Models.Domain.Newsletters;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Newsletter;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/newsletter")]
    [ApiController]
    public class NewslettersApiController : BaseApiController
    {
        private INewslettersService _service = null;
        private IAuthenticationService<int> _authService = null;

        public NewslettersApiController(INewslettersService service,
            ILogger<NewslettersApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;   
            _authService = authService;
        }

        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(NewsletterUpdateRequest model)
        {

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.UpdateNewsletter(model, userId);
                SuccessResponse response = new SuccessResponse();
                return Ok(response);
            }
            catch (Exception ex)
            {
                ErrorResponse response = new ErrorResponse(ex.Message);
                return StatusCode(500, response);  
            }
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

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(NewsletterAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.AddNewsletter(model, userId);
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
        public ActionResult<ItemResponse<Paged<Newsletter>>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Newsletter> page = _service.GetAll(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Newsletter data was not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Newsletter>> { Item = page };
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

    }
}
