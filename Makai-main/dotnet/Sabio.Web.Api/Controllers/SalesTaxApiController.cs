using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Sabio.Models.AppSettings;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Reflection.Emit;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/salestax")]
    [ApiController]
    public class SalesTaxApiController : BaseApiController
    {
        private ISalesTaxService _service = null;
        private IAuthenticationService<int> _authService = null;

        public SalesTaxApiController(ISalesTaxService service
            , ILogger<SalesTaxApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]  
        public async Task<ActionResult<ItemsResponse<List<int>>>> AddFromApi(List<int> postalCodes)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<int> ids = await _service.Add(postalCodes);

                if (ids == null)
                {
                    code = 404;
                    response = new ErrorResponse("Postal Codes not retrieved");
                }
                else
                {
                    response = new ItemsResponse<int> { Items = ids };
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

    };
}
