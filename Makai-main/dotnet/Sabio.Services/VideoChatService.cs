using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Sabio.Models.Domain.VideoChat;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Sabio.Services.Interfaces;
using Microsoft.Extensions.Options;
using Sabio.Data.Providers;
using Sabio.Models.AppSettings;
using System.Net.Http.Json;
using Sabio.Models.Requests.VideoChat;
using Sabio.Models.Domain.VideoChatLog;
using System.Data.SqlClient;
using System.Data;
using Sabio.Data;
using Sabio.Models;
using Microsoft.Extensions.Hosting;

namespace Sabio.Services
{
    public class VideoChatService : IVideoChatService

    {
        private readonly HttpClient _httpClient;
        private ApiKeys _apiKeys;
        IDataProvider _data = null;

        public VideoChatService(IOptions<ApiKeys> apiKeys,
            IDataProvider data)
        {
            _apiKeys = apiKeys.Value;
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri("https://api.daily.co/v1/");
            _data = data;
        }

        #region VideoChat Rooms: CREATE, TOKEN, GET, DELETE
        public async Task<Room> CreateVideoChatRoom(RoomAddRequest model)
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKeys.DailyCoApiApiKey);
                string uri = "rooms/";

                // Calculate expiration time in seconds
                var now = Math.Floor(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1)).TotalSeconds);
                var expirationTime = now + model.Properties.Exp;

                // Convert privacy value from 1 or 0 to "public" or "private" string
                var privacy = model.Privacy == 1 ? "public" : "private";

                var body = new
                {
                    name = model.Name,
                    privacy = privacy,
                    properties = new
                    {
                        start_audio_off = model.Properties.StartAudioOff,
                        start_video_off = model.Properties.StartVideoOff,
                        enable_chat = model.Properties.EnableChat,
                        exp = expirationTime
                    }
                };

                var response = await _httpClient.PostAsJsonAsync(uri, body);
                var result = await response.Content.ReadAsStringAsync();
                var resultJson = JsonConvert.DeserializeObject<Room>(result);

                return resultJson;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public async Task<TokenVideoChat> GetVideoRmToken(TokenAddRequest model)
        {
            try
            {
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKeys.DailyCoApiApiKey);
                string uri = "meeting-tokens/";


                var body = new
                {
                    properties = new
                    {
                        room_name = model.Properties.RoomName,
                        user_name = model.Properties.UserName,
                        user_id = model.Properties.UserId,
                        enable_screenshare = model.Properties.EnableScreenShare,
                        start_video_off = model.Properties.StartVideoOff,
                        start_audio_off = model.Properties.StartAudioOff,
                    }
                };

                var response = await _httpClient.PostAsJsonAsync(uri, body);
                var result = await response.Content.ReadAsStringAsync();
                var resultJson = JsonConvert.DeserializeObject<TokenVideoChat>(result);

                return resultJson;
            }
            catch (Exception ex)
            {
                throw new Exception("Create Video chat Room Failed", ex);
            }
        }
        public async Task<ActiveRoomList> GetActiveRooms(int limit)
        {
            try
            {
                var responseObject = new ActiveRoomList();
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKeys.DailyCoApiApiKey);
                var fullUrl = $"rooms?limit={limit}";

                var response = await _httpClient.GetAsync(fullUrl);

                var content = await response.Content.ReadAsStringAsync();
                responseObject = JsonConvert.DeserializeObject<ActiveRoomList>(content);

                return responseObject;
            }
            catch (Exception ex)
            {
                throw new Exception("Get Meeting Data Failed " + ex.Message);
            }
        }
        public async Task<HttpResponseMessage> DeleteMeeting(string roomName)
        {
            try
            {
                var responseObject = new Log();
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKeys.DailyCoApiApiKey);
                var fullUrl = $"rooms/{roomName}";
                var response = await _httpClient.DeleteAsync(fullUrl);

                return response;

            }
            catch (Exception ex)
            {
                throw new Exception("Unable to retrieve Active Room List", ex);
            }
        }
        #endregion

        #region Chat Statistics: GET, CREATE, DELETE
        public ChatStatistics GetChatStatisticsById(int id)
        {
            ChatStatistics statistics = null;

            string procName = "[dbo].[DailyMeetings_Select_ById]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                statistics = MapSingleChatStatistics(reader, ref startingIndex);
            }
            );
            return statistics;
        }

        public Paged<ChatStatistics> GetChatStatisticsByCreator(int pageIndex, int pageSize, int createdBy)
        {
            Paged<ChatStatistics> pagedList = null;
            List<ChatStatistics> list = null;
            int totalCount = 0;

            string procName = "[dbo].[DailyMeetings_Select_ByCreatedBy]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@CreatedBy", createdBy);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                ChatStatistics statistics = MapSingleChatStatistics(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<ChatStatistics>(pageSize);
                }
                list.Add(statistics);
            }
            );
            if (list != null)
            {
                pagedList = new Paged<ChatStatistics>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<ChatStatistics> GetChatStatisticsAll(int pageIndex, int pageSize)
        {
            Paged<ChatStatistics> pagedList = null;
            List<ChatStatistics> list = null;
            int totalCount = 0;

            string procName = "[dbo].[DailyMeetings_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                ChatStatistics statistics = MapSingleChatStatistics(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<ChatStatistics>(pageSize);
                }
                list.Add(statistics);
            }
            );
            if (list != null)
            {
                pagedList = new Paged<ChatStatistics>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public List<ChatStatsDaily> GetChatStatsDailyAndHost(int days, int host)
        {
            string procName = "[dbo].[DailyMeetings_Select_ByDaysAndHost]";
            List<ChatStatsDaily> listOfChatStatsDaily = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Days", days);
                paramCollection.AddWithValue("@Host", host);
            }
            , delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                ChatStatsDaily donation = MapSingleChatStatsDaily(reader, ref startingIndex);
                if (listOfChatStatsDaily == null)
                {
                    listOfChatStatsDaily = new List<ChatStatsDaily>();
                }
                listOfChatStatsDaily.Add(donation);
            }
            );
            return listOfChatStatsDaily;
        }
        public List<ChatStatsDaily> GetChatStatsDaily(int days)
        {
            string procName = "[dbo].[DailyMeetings_Select_ByDays]";
            List<ChatStatsDaily> listOfChatStatsDaily = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Days", days);
            }
            , delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                ChatStatsDaily donation = MapSingleChatStatsDaily(reader, ref startingIndex);
                if (listOfChatStatsDaily == null)
                {
                    listOfChatStatsDaily = new List<ChatStatsDaily>();
                }
                listOfChatStatsDaily.Add(donation);
            }
            );
            return listOfChatStatsDaily;
        }

        public int AddChatStatistics(ChatStatisticsAddRequest model)
        {
            int id = 0;

            string procName = "[dbo].[DailyMeetings_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParamsChatStatistics(model, col);           
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);

                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object objectId = returnCollection["@Id"].Value;
                int.TryParse(objectId.ToString(), out id);
            });
            return id;
        }

        public void DeleteChatStatistics(int id)
        {
            string procName = "[dbo].[DailyMeetings_Delete_ById]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            }, returnParameters: null);
        }

        public void AddMeetingParticipant(ParticipantAddRequest model)
        {
            string procName = "[dbo].[MeetingParticipants_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParamsParticipant(model, col);
            }, returnParameters: null);
        }

        #endregion

        #region MAPPER AND COMMON PARAMS
        public ChatStatistics MapSingleChatStatistics(IDataReader reader, ref int startingIndex)
        {
            ChatStatistics statistics = new ChatStatistics();

            statistics.Id = reader.GetSafeInt32(startingIndex++);
            statistics.HostId = reader.GetSafeInt32(startingIndex++);
            statistics.DailyId = reader.GetSafeString(startingIndex++);
            statistics.RoomName = reader.GetSafeString(startingIndex++);
            statistics.Duration = reader.GetSafeInt32(startingIndex++);
            statistics.StartTime = reader.GetSafeDateTime(startingIndex++);
            statistics.Participants = reader.DeserializeObject<List<Participant>>(startingIndex++);

            return statistics;
        }
        public ChatStatsDaily MapSingleChatStatsDaily(IDataReader reader, ref int startingIndex)
        {
            ChatStatsDaily statistics = new ChatStatsDaily();

            statistics.Date = reader.GetSafeDateTime(startingIndex++);
            statistics.TotalMeetings = reader.GetSafeInt32(startingIndex++);
            statistics.TotalDuration = reader.GetSafeInt32(startingIndex++);
            statistics.TotalParticipants = reader.GetSafeInt32(startingIndex++);

            return statistics;
        }

        private static void AddCommonParamsChatStatistics(ChatStatisticsAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@HostId", model.HostId);
            col.AddWithValue("@DailyId", model.DailyId);
            col.AddWithValue("@RoomName", model.RoomName);
            col.AddWithValue("@Duration", model.Duration);
            col.AddWithValue("@StartTime", model.StartTime);
        }
        private static void AddCommonParamsParticipant(ParticipantAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@DailyMeetingId", model.DailyMeetingId);
            col.AddWithValue("@UserId", model.UserId);
            col.AddWithValue("@Duration", model.Duration);
            col.AddWithValue("@TimeJoined", model.TimeJoined);

        }

        #endregion


    }
}