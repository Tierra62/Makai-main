using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sabio.Web.Controllers;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.Logging;
using Sabio.Services.Interfaces;
using Sabio.Models.Domain.VideoChat;
using Sabio.Models.Requests.VideoChat;
using Sabio.Web.Models.Responses;
using Sabio.Services;
using Sabio.Models;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers.VideoChat
{
    [Route("api/rooms")]
    [ApiController]

    public class VideoChatApiController : BaseApiController
    {
        private IVideoChatService _videoChatService;
        private IAuthenticationService<int> _authService = null;

        public VideoChatApiController(IVideoChatService videoChatService
            , ILogger<VideoChatApiController> logger
            , IAuthenticationService<int> authService) :
            base(logger)
        {
            _videoChatService = videoChatService;
            _authService = authService;
        }

        #region ENDPOINTS : ROOMS
        [HttpPost]
        public async Task<ActionResult<Room>> CreateVideoChatRoom(RoomAddRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                Room room = await _videoChatService.CreateVideoChatRoom(model);

                if (room == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Room not created");
                }
                else
                {
                    response = new ItemResponse<Room>() { Item = room };
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


        [HttpPost("token")]
        public ActionResult<ItemResponse<TokenVideoChat>> GetToken(TokenAddRequest data)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                TokenVideoChat aToken = _videoChatService.GetVideoRmToken(data).Result;

                if (aToken == null)
                {
                    code = 404;
                    response = new ErrorResponse("Meeting Data not collected");
                }
                else
                {
                    response = new ItemResponse<TokenVideoChat>() { Item = aToken };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }


        [HttpGet("active")]
        public ActionResult<ItemResponse<ActiveRoomList>> GetActiveRooms(int limit)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                ActiveRoomList activeRooms = _videoChatService.GetActiveRooms(limit).Result;

                if (activeRooms == null)
                {
                    code = 404;
                    response = new ErrorResponse("Meeting data not collected");
                }
                else
                {
                    response = new ItemResponse<ActiveRoomList>() { Item = activeRooms };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }

        [HttpDelete("room")]
        public ActionResult<SuccessResponse> Delete(string roomName)
        {
            int code = 200;
            BaseResponse response = null;//do not declare an instance.

            try
            {
                _videoChatService.DeleteMeeting(roomName);

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
        #region CHAT STATISTICS

        [HttpGet("statistics")]
        public ActionResult<ItemResponse<Paged<ChatStatistics>>> ChatStatisticsGetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<ChatStatistics> page = _videoChatService.GetChatStatisticsAll(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<ChatStatistics>> { Item = page };
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

        [HttpGet("statistics/{id:int}")]
        public ActionResult<ItemResponse<ChatStatistics>> ChatStatisticsById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                ChatStatistics statistics = _videoChatService.GetChatStatisticsById(id);

                if (statistics == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Record not found.");
                }
                else
                {
                    response = new ItemResponse<ChatStatistics> { Item = statistics };
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

        [HttpGet("statistics/createdby/{id:int}")]
        public ActionResult<ItemResponse<Paged<ChatStatistics>>> ChatStatisticsByCreator(int pageIndex, int pageSize, int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<ChatStatistics> page = _videoChatService.GetChatStatisticsByCreator(pageIndex, pageSize, id);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<ChatStatistics>> { Item = page };
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

        [HttpGet("statistics/daily")]
        public ActionResult<ItemsResponse<ChatStatsDaily>> ChatStatsDaily(int days)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<ChatStatsDaily> listDonations = _videoChatService.GetChatStatsDaily(days);

                if (listDonations == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Record not found.");
                }
                else
                {
                    response = new ItemsResponse<ChatStatsDaily> { Items = listDonations };
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

        [HttpGet("statistics/dailyhost")]
        public ActionResult<ItemsResponse<ChatStatsDaily>> ChatStatsDailyAndHost(int days)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                int host = _authService.GetCurrentUserId();
                List<ChatStatsDaily> listDonations = _videoChatService.GetChatStatsDailyAndHost(days, host);

                if (listDonations == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Record not found.");
                }
                else
                {
                    response = new ItemsResponse<ChatStatsDaily> { Items = listDonations };
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

        [HttpPost("statistics")]
        public ActionResult<ItemResponse<int>> CreateChatStatistics(ChatStatisticsAddRequest model)
        {
            ObjectResult result = null;
            try
            {              
                int id = _videoChatService.AddChatStatistics(model);
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

        [HttpDelete("statistics/delete/{id:int}")]
        public ActionResult<SuccessResponse> ChatStatisticsDelete(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _videoChatService.DeleteChatStatistics(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }


        [HttpPost("statistics/participant")]
        public ActionResult<ItemResponse<int>> CreateMeetingParticipant(ParticipantAddRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _videoChatService.AddMeetingParticipant(model);
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
