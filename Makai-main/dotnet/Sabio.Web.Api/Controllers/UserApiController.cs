using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.AppSettings;
using Sabio.Models.Domain;
using Sabio.Models.Domain.LoginLog;
using Sabio.Models.Domain.LoyaltyPoints;
using Sabio.Models.Domain.Metrics;
using Sabio.Models.Enums;
using Sabio.Models.Requests.LoyaltyPoints;
using Sabio.Models.Requests.Users;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserApiController : BaseApiController
    {
        private IUserService _service = null;
        private IAuthenticationService<int> _authService = null;
        private IEmailService _emailService = null;
        private ILoyaltyPointService _loyaltyPointService = null;

        public UserApiController(IUserService service, IAuthenticationService<int> authService, IEmailService emailService, ILoyaltyPointService loyaltyPointService,
            ILogger<UserApiController> logger) : base(logger)
        {
            _service = service;
            _authService = authService;
            _emailService = emailService;
            _loyaltyPointService = loyaltyPointService;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<User>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                User user = _service.GetById(id);

                if (user == null)
                {

                    iCode = 404;
                    response = new ErrorResponse($"Specified UserId was not found.");

                }
                else
                {

                    response = new ItemResponse<User>() { Item = user };

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

        [HttpGet("")]
        public ActionResult<ItemResponse<Paged<User>>> GetAll(int pageIndex, int pageSize)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<User> page = _service.GetAll(pageIndex, pageSize);

                if (page == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Users data could not be found");
                }
                else
                {
                    response = new ItemResponse<Paged<User>>() { Item = page };
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

        [HttpGet("admin")]
        public ActionResult<ItemResponse<Paged<User>>> GetAllByUserName(int pageIndex, int pageSize, string query)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Paged<User> page = _service.GetAllByUserName(pageIndex, pageSize, query);

                if (page == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Users' data could not be found");
                }
                else
                {
                    response = new ItemResponse<Paged<User>>() { Item = page };
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

        [HttpGet("current")]
        public ActionResult<ItemResponse<IUserAuthData>> GetCurrrent()
        {
            IUserAuthData user = _authService.GetCurrentUser();
            ItemResponse<IUserAuthData> response = new ItemResponse<IUserAuthData>();
            response.Item = user;

            return Ok200(response);
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult<ItemResponse<int>> Create(UserAddRequest model)
        {
            ObjectResult result = null;

            string token = Guid.NewGuid().ToString();
            int tokenType = (int)TokenType.NewUser;

            try
            {
                int id = _service.Add(model);

                _service.AddToken(token, id, tokenType);

                _emailService.SendEmailConfirm(model, token);

                ItemResponse<int> response = new ItemResponse<int> { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                ErrorResponse response = new ErrorResponse(ex.Message);
                Logger.LogError(ex.ToString());

                result = StatusCode(500, response);
            }

            return result;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<SuccessResponse>> LogIn(UserLoginRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                bool isValid = await _service.LogInAsync(model.Email, model.Password);

                if (isValid == false)
                {
                    iCode = 401;
                    response = new ErrorResponse("User data could not be validated");
                }
                else
                {
                    int userId = _service.GetUserIdByEmail(model.Email);
                    string ipAddress = HttpContext.Connection.RemoteIpAddress.ToString();
                    _service.LogUserLogin(model.Email, ipAddress, userId);

                    response = new SuccessResponse();
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(iCode, response);
        }

        [HttpPost("logout")]
        public ActionResult<SuccessResponse> LogOut()
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _authService.LogOutAsync();
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(iCode, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(UserUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.Update(model);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(iCode, response);
        }

        [HttpPut("{id:int}/status/{statusId:int}")]
        public ActionResult<SuccessResponse> UpdateStatus(int id, int statusId)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                _service.UpdateStatus(id, statusId);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(iCode, response);

        }

        [HttpPut("2fa/{twoFA:bool}")]
        public ActionResult<SuccessResponse> Update2FA(bool twoFA)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update2FA(userId, twoFA);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(iCode, response);

        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<User>>> SearchPaginated(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<User> paged = _service.SearchPaginated(pageIndex, pageSize, query);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Records Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<User>> { Item = paged };
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

        [HttpGet("search/filter")]
        public ActionResult<ItemResponse<Paged<User>>> SearchPaginatedFiltered(int pageIndex, int pageSize, string query, int statusId)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                Paged<User> paged = _service.SearchPaginatedFiltered(pageIndex, pageSize, query, statusId);
                if (paged == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Records not found");
                }
                else
                {
                    response = new ItemResponse<Paged<User>> { Item = paged };
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

        [HttpGet("metrics")]
        public ActionResult<ItemResponse<DashboardMetric>> GetMetrics()
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                DashboardMetric metric = _service.GetMetrics();
                if (metric == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource Not Found");
                }
                else
                {
                    response = new ItemResponse<DashboardMetric> { Item = metric };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode,response);
        }

        [HttpPut("confirm")]
        [AllowAnonymous]
        public ActionResult<SuccessResponse> ConfirmEmail(string email, string token)
        {
            int iCode = 200;
            BaseResponse response = null;
            const int registerSourceId = 312;

            try
            {
                _service.UpdateConfirmed(email, token);
                response = new SuccessResponse();

                int userId = _service.GetUserIdByEmail(email);
                LoyaltyPointAddRequest loyaltyModel = new LoyaltyPointAddRequest
                {
                    SourceId = registerSourceId
                };
                _loyaltyPointService.Add(loyaltyModel, userId); 


            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(iCode, response);
        }

        [HttpPut("forgot")]
        [AllowAnonymous]
        public ActionResult<SuccessResponse> ForgotPassword(string email)
        {
            int iCode = 200;
            BaseResponse response = null;

            string token = Guid.NewGuid().ToString();
            int tokenType = (int)TokenType.ResetPassword;

            try
            {
                _service.AddResetToken(email, token, tokenType);

                _emailService.SendResetPassword(email, token); 

                response = new SuccessResponse();
            }
            catch(Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(iCode, response);
        }

        [HttpPut("changepassword")]
        [AllowAnonymous]
        public ActionResult<SuccessResponse> ChangePassword(ChangePassword model)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                _service.ChangePassword(model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(iCode, response);
        }

        [HttpPut("password")]
        public ActionResult<SuccessResponse> ChangePasswordV2(ChangePasswordV2 model)
        {
            int iCode = 200;
            BaseResponse response = null;
            string token = Guid.NewGuid().ToString();
            int tokenType = (int)TokenType.PasswordChanged;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.ChangePasswordV2(userId, model);
                _service.AddToken(token, userId, tokenType);
                _emailService.SendPasswordChanged(model.Email, token);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(iCode, response);
        }

        [HttpPut("email")]
        public ActionResult<SuccessResponse> UpdateEmail(UserEmailUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.UpdateEmail(userId, model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("loginlog")]
        public ActionResult<ItemResponse<Paged<LoginLog>>> LoginLogGetByUserId(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<LoginLog> page = _service.LoginLogGetByUserId(pageIndex, pageSize, userId);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<LoginLog>>() { Item = page };
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
