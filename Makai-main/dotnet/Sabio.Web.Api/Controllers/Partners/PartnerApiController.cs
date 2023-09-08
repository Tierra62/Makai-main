using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Services;
using Sabio.Models.Domain.Partners;
using Sabio.Models.Requests.Partners;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using Sabio.Web.StartUp;
using System;
using Sabio.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;


namespace Sabio.Web.Api.Controllers.Partners
{
    [Route("api/partners")]
    [ApiController]
    public class PartnerApiController : BaseApiController
    {
        private IPartnerService _service = null;
        private IAuthenticationService<int> _authService = null;
        public PartnerApiController(IPartnerService service,
                ILogger<PartnerApiController> logger,
                IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }


        [HttpGet("legacy/{id:int}"), Obsolete]
        public ActionResult<ItemResponse<Partner>> GetObsolete(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Partner partner = _service.Get(id);

                if (partner == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found");
                }
                else
                {
                    response = new ItemResponse<Partner> { Item = partner };
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


        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(PartnerAddRequest request)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(userId, request);
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
        public ActionResult<SuccessResponse> Delete(int id)
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


        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(PartnerUpdateRequest request)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(userId, request);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }


        [HttpGet("legacy"), Obsolete]
        public ActionResult<ItemResponse<Paged<Partner>>> GetPageObsolete(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Partner> page = _service.GetAllPaginated(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Partner>> { Item = page };
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


        [HttpGet("legacy/search"), Obsolete]
        public ActionResult<ItemResponse<Paged<Partner>>> SearchPaginatedObsolete(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Partner> page = _service.SearchPaginated(pageIndex, pageSize, query);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Partner>> { Item = page };
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


        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Partner>> Get(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                PartnerDetails partner = _service.GetDetails(id);

                if (partner == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found");
                }
                else
                {
                    response = new ItemResponse<PartnerDetails> { Item = partner };
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

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<PartnerDetails>>> GetPage(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<PartnerDetails> page = _service.GetAllDetails(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<PartnerDetails>> { Item = page };
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
        public ActionResult<ItemsResponse<List<Partner>>> GetAll()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<Partner> list = _service.GetAll();
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Partner not found.");
                }
                else
                {
                    response = new ItemsResponse<Partner>() { Items = list };
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

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<PartnerDetails>>> SearchPaginated(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<PartnerDetails> page = _service.SearchPaginatedDetails(pageIndex, pageSize, query);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<PartnerDetails>> { Item = page };
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
