using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain.GroupDiscounts;
using Sabio.Models.Requests.GroupDiscount;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using Stripe;
using System;
using System.Data.SqlClient;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/groupdiscounts")]
    [ApiController]
    public class GroupDiscountApiController : BaseApiController
    {

        IGroupDiscountService _groupDiscountService;
        IAuthenticationService<int> _authService;
        public GroupDiscountApiController(IGroupDiscountService groupsDiscountService, IAuthenticationService<int> authService, ILogger<GroupDiscountApiController> logger) : base(logger)// is an interface that helps logs any type of ApiControllers.
        {
            _groupDiscountService = groupsDiscountService;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult <ItemsResponse<int>> Create(GroupDiscountAddRequest model)
        {
            ObjectResult result;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _groupDiscountService.Add(model, userId);
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

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<GroupDiscount>> Get(int id) 
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
               
                GroupDiscount aGroupDiscount = _groupDiscountService.Get(id);
              

                if (aGroupDiscount == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource nor found");
                }
                else
                {

                    response = new ItemResponse<GroupDiscount> { Item = aGroupDiscount };
                }
            }
            catch (SqlException SqlEx)
            {
                iCode = 500;
                response = new ErrorResponse(($"Generic Error:${SqlEx.Message}"));

            }
            catch (ArgumentException argEx)
            {
                iCode = 500;
                response = new ErrorResponse(($"Generic Error:${argEx.Message}"));

            }
            catch (Exception ex)
            {
                iCode = 500;

                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(($"Generic Error:${ex.Message}"));

            }


            return StatusCode(iCode, response);



        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(GroupDiscountUpdateRequest model) 
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _groupDiscountService.Update(model,userId);
                response = new SuccessResponse();
                
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}/{isDeleted}")]
        public ActionResult<SuccessResponse> Delete(int id, bool isDeleted)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _groupDiscountService.UpdateIsDeleted(id, isDeleted);
                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpPut("status/{id:int}/{isActive}")]
        public ActionResult<SuccessResponse> Active(int id, bool isActive) 
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _groupDiscountService.UpdateIsActive(id, isActive);
                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("partner")]
        public ActionResult<ItemResponse<Paged<GroupDiscount>>> PaginatedByPartnerId(int pageIndex, int pageSize)
        {

            ActionResult result;
            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<GroupDiscount> paged = _groupDiscountService.GetByPartnerId(userId, pageIndex, pageSize);

                if (paged == null)
                {

                    result = NotFound404(new ErrorResponse("App Resource not found."));
                }
                else
                {
                    ItemResponse<Paged<GroupDiscount>> response = new ItemResponse<Paged<GroupDiscount>>();
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

        [HttpGet("date")]
        public ActionResult<ItemResponse<Paged<GroupDiscount>>> PaginatedByDate(DateTime startDate, DateTime endDate, int pageIndex, int pageSize)
        {

            ActionResult result;
            try
            {
                Paged<GroupDiscount> paged = _groupDiscountService.GetByDate(startDate,endDate, pageIndex, pageSize);

                if (paged == null)
                {

                    result = NotFound404(new ErrorResponse("App Resource not found."));
                }
                else
                {
                    ItemResponse<Paged<GroupDiscount>> response = new ItemResponse<Paged<GroupDiscount>>();
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



    }
}
