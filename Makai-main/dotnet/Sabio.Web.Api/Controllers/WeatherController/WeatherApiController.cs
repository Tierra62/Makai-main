using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Framework;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Sabio.Models.AppSettings;
using Sabio.Models.Domain.WeatherModels;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers.Weather
{
    [Route("api/weather")]
    [ApiController]
    public class WeatherApiController : BaseApiController
    {
        private IWeatherService _service = null;
       
        public WeatherApiController(IWeatherService service
          ,ILogger<WeatherApiController> logger): 
            base (logger)
        {
           
            _service = service;
        }
        [HttpGet("{q}")]
        [AllowAnonymous]
        public ActionResult<ItemsResponse<WeatherResponse>> Get(string q)
        {

            int iCode = 200;
            BaseResponse response = null;
            try
            {
                WeatherResponse weather = _service.GetCurrent(q);

                if (weather == null)

                {

                    iCode = 404;
                    response = new ErrorResponse("Application Resource Not Found");

                }
                else
                {
                    response = new ItemResponse<WeatherResponse> { Item = weather };
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
    }
}
