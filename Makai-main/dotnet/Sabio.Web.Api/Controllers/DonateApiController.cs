using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Services.Interfaces;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System.Collections.Generic;
using System;
using Sabio.Models.Domain.CharitableFunds;
using Sabio.Models;
using Microsoft.AspNetCore.Authorization;
using Sabio.Models.Requests.CharitableFunds;
using Sabio.Models.Domain.Donations;
using Sabio.Models.Requests.Donations;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/donate")]
    [ApiController]
    public class DonateApiController : BaseApiController
    {
        private IDonateService _service = null;
        private IAuthenticationService<int> _authService = null;
        public DonateApiController(IDonateService service
            , ILogger<DonateApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        #region CHARITABLEFUNDS ENDPOINTS
        [HttpGet("charitablefund/{id:int}")]
        public ActionResult<ItemResponse<CharitableFund>> CharitableFundGet(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                CharitableFund charityFund = _service.GetCharitableFund(id);

                if (charityFund == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Record not found.");
                }
                else
                {
                    response = new ItemResponse<CharitableFund> { Item = charityFund };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;

                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("charitablefund")]
        public ActionResult<ItemResponse<Paged<CharitableFund>>> CharitableFundGetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<CharitableFund> page = _service.GetAllCharitableFund(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<CharitableFund>> { Item = page };
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


        [HttpGet("charitablefund/createdby/{id:int}")]
        public ActionResult<ItemResponse<CharitableFund>> CharitableFundGetCreatedBy(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                CharitableFund charityFund = _service.GetByCreatorCharitableFund(id);

                if (charityFund == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Record not found.");
                }
                else
                {
                    response = new ItemResponse<CharitableFund> { Item = charityFund };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;

                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpPost("charitablefund")]       
        public ActionResult<ItemResponse<int>> CharitableFundCreate(CharitableFundAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int createdBy = _authService.GetCurrentUserId();
                int id = _service.AddCharitableFund(model, createdBy);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString(), ex);
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpDelete("charitablefund/delete/{id:int}")]
        public ActionResult<SuccessResponse> CharitableFundDelete(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.DeleteCharitableFund(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpPut("charitablefund/{id:int}")]
        public ActionResult<SuccessResponse> CharitableFundUpdate(CharitableFundUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.UpdateCharitableFund(model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
        #endregion


        #region DONATIONS ENDPOINTS
        [HttpGet("donations/bycharity/{charityId:int}")]
        public ActionResult<ItemResponse<Donation>> DonationGetByCharityId(int charityId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<Donation> listDonations = _service.GetByCharityIdDonation(charityId);

                if (listDonations == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Record not found.");
                }
                else
                {
                    response = new ItemsResponse<Donation> { Items = listDonations };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;

                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("donations/createdBy/{createdBy:int}")]
        public ActionResult<ItemResponse<Donation>> DonationGetByCreatedBy(int createdBy)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<Donation> listDonations = _service.GetByCreatorDonation(createdBy);

                if (listDonations == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Record not found.");
                }
                else
                {
                    response = new ItemsResponse<Donation> { Items = listDonations };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;

                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("donations/summary")]
        public ActionResult<ItemResponse<DSummary>> DonationGetSummary(DateTime dateStart, DateTime dateEnd)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<DSummary> listDonations = _service.GetSummaryDonation(dateStart, dateEnd);

                if (listDonations == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Record not found.");
                }
                else
                {
                    response = new ItemsResponse<DSummary> { Items = listDonations };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;

                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }

        [HttpPost("donation")]
        public ActionResult<ItemResponse<int>> DonationCreate(DonationAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int createdBy = _authService.GetCurrentUserId();
                int id = _service.AddDonation(model, createdBy);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString(), ex);
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }
        #endregion


    }
}
