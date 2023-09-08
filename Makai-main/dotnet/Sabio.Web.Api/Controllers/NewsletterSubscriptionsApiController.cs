using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System.Collections.Generic;
using System;
using Sabio.Models.Domain;
using Sabio.Services;
using Microsoft.AspNetCore.Authorization;
using Sabio.Models;
using Sabio.Models.Requests;
using System.Text;
using Sabio.Web.Models;
using System.Drawing.Printing;
using Sabio.Services.Interfaces;
using Sabio.Models.AppSettings;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/newsletter/subscriptions")]
    [ApiController]
    public class NewsletterSubscriptionsApiController : BaseApiController
    {
        private INewsletterSubscriptionsService _service = null;
        private IAuthenticationService<int> _authService = null;
        private IEmailService _emailService = null;

        public NewsletterSubscriptionsApiController(INewsletterSubscriptionsService service,
            ILogger<NewsletterSubscriptionsApiController> logger, IEmailService emailService,
            IAuthenticationService<int> authService) : base(logger)

        {
            _service = service;
            _authService = authService;
            _emailService = emailService;
        }

        [HttpGet("email")]
        //[HttpGet("{email}")]

        public ActionResult<ItemResponse<NewsletterSubscription>> Get(string subscriber)
        {
            int code = 200;
            BaseResponse response = null;


            try
            {
                NewsletterSubscription newsletterSubscription = _service.Get(subscriber);

                if (newsletterSubscription == null)
                {
                    code = 404;
                    response = new ErrorResponse("The provided email was not found.");
                }
                else
                {
                    response = new ItemResponse<NewsletterSubscription> { Item = newsletterSubscription };
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

        [HttpGet]
        public ActionResult<ItemResponse<Paged<NewsletterSubscription>>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<NewsletterSubscription> page = _service.GetAll(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Newsletter subscription data was not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<NewsletterSubscription>> { Item = page };
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

        [HttpGet("subscribed")]
        public ActionResult<ItemResponse<Paged<NewsletterSubscription>>> GetAllSubscribed(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<NewsletterSubscription> page = _service.GetAllSubscribed(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Newsletter subscription data was not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<NewsletterSubscription>> { Item = page };
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

        [HttpGet("unsubscribed")]
        public ActionResult<ItemResponse<Paged<NewsletterSubscription>>> GetAllNotSubscribed(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<NewsletterSubscription> page = _service.GetAllNotSubscribed(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Newsletter subscription data was not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<NewsletterSubscription>> { Item = page };
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

        [HttpPost]
        public ActionResult<SuccessResponse> Create(NewsletterSubscriptionAddRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Add(model);
                _emailService.SubscribeEmail(model);

                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpPut]
        public ActionResult<SuccessResponse> Update(NewsletterSubscriptionUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Update(model);
                _emailService.UnsubcribeEmail(model);

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
