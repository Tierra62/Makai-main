using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Requests.FAQs;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using Sabio.Web.StartUp;
using System.Data.SqlClient;
using System;
using Sabio.Models.Domain.FAQs;
using System.Collections.Generic;
using System.Net;
using Microsoft.AspNetCore.Authorization;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/faqs")]
    [ApiController]
    public class FAQsApiController : BaseApiController
    {
        private IFaqsService _service = null;
        private IAuthenticationService<int> _authService = null;
        public FAQsApiController(IFaqsService service
            , ILogger<FAQsApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Faqs>> Get(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {

                Faqs faq = _service.Get(id);

                if (faq == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("FAQ not found.");
                }
                else
                {
                    response = new ItemResponse<Faqs> { Item = faq };
                }
            }

            catch (SqlException sqlEx)
            {

                iCode = 500;
                response = new ErrorResponse($"SqlException Error: ${sqlEx.Message}");
                base.Logger.LogError(sqlEx.ToString());

            }

            catch (ArgumentException argEx)
            {
                iCode = 500;
                response = new ErrorResponse($"ArgumentException Error: ${argEx.Message}");
            }

            catch (Exception ex)
            {
                iCode = 500;

                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [AllowAnonymous]
        [HttpGet("")]
        public ActionResult<ItemsResponse<Faqs>> GetAllFaqs()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<Faqs> list = _service.GetAllFaqs();

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemsResponse<Faqs> { Items = list };
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

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(FaqsUpdateRequest model)
        {
            int code = 200;
            BaseResponse response=null;
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

            return StatusCode(code,response);
        }

        [HttpPost]
        public ActionResult<SuccessResponse> Create(FaqsAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();

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

        [HttpDelete("{id:int}")]
        public ActionResult Delete(int id)
        {

            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);

                response = new SuccessResponse();
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
