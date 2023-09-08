using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Services.Interfaces;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Models.Requests.Stripe;
using Sabio.Web.Models.Responses;
using System;
using Stripe;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/accounts")]
    [ApiController]
    public class StripeConnectApiController : BaseApiController
    {
        private IStripeConnectService _service = null;
        private IAuthenticationService<int> _authService = null;

        public StripeConnectApiController(IStripeConnectService service
         , ILogger<StripeConnectApiController> logger
        , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> CreateAccount(AccountAddRequest userInfo)
        {
            ObjectResult result = null;

            try
            {
                string account = _service.AddAccount(userInfo);
                ItemResponse<string> response = new ItemResponse<string>() { Item = account };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                ErrorResponse response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
                result = StatusCode(500, response);
            }
            return result;
        }
        [HttpPost("links")]
        public ActionResult<ItemResponse<int>> AddAccountLink(AccountLinkAddRequest userInfo)
        {
            ObjectResult result = null;

            try
            {
                string account = _service.AddAccountLink(userInfo);
                ItemResponse<string> response = new ItemResponse<string>() { Item = account };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                ErrorResponse response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Account>> GetAccount(string accountId)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                Account aAccount = _service.GetAccount(accountId);

                if (aAccount == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not found.");
                }
                else
                {
                    response = new ItemResponse<Account>() { Item = aAccount };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: ${ex.Message}");
            }
            return StatusCode(iCode, response);
        }
        [HttpPost("transfer")]
        public ActionResult<ItemResponse<string>> TransferPayment(TransferPaymentRequest paymentRequest)
        {
            ObjectResult result = null;

            try
            {
                string payment = _service.TransferPayment(paymentRequest);
                ItemResponse<string> response = new ItemResponse<string>() { Item = payment };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                ErrorResponse response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
                result = StatusCode(500, response);
            }
            return result;
        }
        [HttpPost("transferId")]
        public ActionResult<ItemResponse<Transfer>> GetTransfer(AccountLinkAddRequest transferId)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                Transfer aTransfer = _service.GetTransfer(transferId);

                if (aTransfer == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not found.");
                }
                else
                {
                    response = new ItemResponse<Transfer>() { Item = aTransfer };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: ${ex.Message}");
            }
            return StatusCode(iCode, response);
        }
    }
}
