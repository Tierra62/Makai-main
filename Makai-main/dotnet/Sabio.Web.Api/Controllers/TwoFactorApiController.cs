using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Messages;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/2fa")]
    [ApiController]
    public class TwoFactorApiController : BaseApiController
    {
        private ITwoFactorService _service = null;
        private IAuthenticationService<int> _authService = null;
        public TwoFactorApiController(ITwoFactorService service, ILogger<TwoFactorApiController> logger, IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<SuccessResponse> Add(TwoFactorRequest model)
        {
            int code = 201;
            BaseResponse response = null;
            try
            {
                model.MobilePhone = "+1" + model.MobilePhone;
                _service.CreateSms(model);
                response = new SuccessResponse();
            }
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet]
        public async Task<ActionResult<ItemResponse<string>>> GetAsync(string mobilePhone, string code)
        {
            int responseCode = 200;
            BaseResponse response = null;
            try
            {
                string tempPhone = "+1" + mobilePhone;
                string result = await _service.CheckSms(tempPhone, code);
                response = new ItemResponse<string> { Item = result };
            }
            catch(Exception ex)
            {
                responseCode = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(responseCode, response);
        }
    }
}
