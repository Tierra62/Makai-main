using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Framework;
using Microsoft.Extensions.Configuration.UserSecrets;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.ExternalLinks;
using Sabio.Services.Interfaces;
using Sabio.Models.Requests.ExternalLinks;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/externallinks")]
    [ApiController]
    public class ExternalLinkApiController : BaseApiController
    {
        private IExternalLinkService _service;
        private IAuthenticationService<int> _authService;
        public ExternalLinkApiController(IExternalLinkService service, ILogger<ExternalLinkApiController> logger, IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }
        [HttpGet()]
        public ActionResult<ItemsResponse<ExternalLink>> GetByCreatorId()
        {
            int code = 200;
            BaseResponse response;
            try
            {
                int userId = _authService.GetCurrentUserId();
                List<ExternalLink> list = _service.GetByCreatorId(userId);
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application or resourse requested was not found.");
                }
                else
                {
                    response = new ItemsResponse<ExternalLink> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        } 
        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(ExternalLinkAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId  = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);
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
        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(ExternalLinkUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);
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
        public ActionResult<SuccessResponse> Delete (int id)
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
        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<ExternalLink>> GetById(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                ExternalLink eLink = _service.GetById(id);

                if (eLink == null)
                {
                    code = 404;
                    response = new ErrorResponse("No external links were found with the entered ID.");
                }
                else
                {
                    response = new ItemResponse<ExternalLink> { Item = eLink };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
    }
}
