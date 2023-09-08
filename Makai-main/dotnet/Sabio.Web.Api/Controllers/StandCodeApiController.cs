using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.StandCodes;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
namespace Sabio.Web.Api.Controllers
{
    [Route("api/stand/codes")]
    [ApiController]
    public class StandCodesApiController : BaseApiController
    {
        private IStandCodeService _service = null;
        IAuthenticationService<int> _authService = null;

        public StandCodesApiController(IStandCodeService service,
             ILogger<StandCodesApiController> logger,
             IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        #region ENDPOINTS
        [HttpPost("{standId:int}")]
        public ActionResult<ItemResponse<int>> Add(int standId)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                Guid uuid = _service.Add(userId, standId);
                ItemResponse<Guid> response = new ItemResponse<Guid> { Item = uuid };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<StandCode>>> GetPaginated(int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<StandCode> standCode = _service.GetPaginated(pageIndex, pageSize);
                if (standCode == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<StandCode>> { Item = standCode };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<StandCode>> GetStandCodeById(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                StandCode standCode = _service.GetById(id);

                if (standCode == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemResponse<StandCode> { Item = standCode };
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

        [HttpGet("bycode")]
        public ActionResult<ItemResponse<StandCode>> GetStandCodeByCode(string ucode)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                StandCode standCode = _service.GetByCode(ucode);

                if (standCode == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemResponse<StandCode> { Item = standCode };
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
        public ActionResult<SuccessResponse> DeleteById(int id)
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
        #endregion

    }
}
