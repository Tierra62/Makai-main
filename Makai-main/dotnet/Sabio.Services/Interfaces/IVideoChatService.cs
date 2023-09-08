
using Sabio.Models.Requests.VideoChat;
using Sabio.Models.Domain.VideoChat;
using System.Threading.Tasks;
using System.Net.Http;
using Sabio.Models;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IVideoChatService
    {
        Task<Room> CreateVideoChatRoom(RoomAddRequest model);
        Task<TokenVideoChat> GetVideoRmToken(TokenAddRequest model);
        Task<ActiveRoomList> GetActiveRooms(int limit);
        Task<HttpResponseMessage> DeleteMeeting(string roomName);
        ChatStatistics GetChatStatisticsById(int id);
        Paged<ChatStatistics> GetChatStatisticsByCreator(int pageIndex, int pageSize, int createdBy);
        Paged<ChatStatistics> GetChatStatisticsAll(int pageIndex, int pageSize);
        int AddChatStatistics(ChatStatisticsAddRequest model);
        void DeleteChatStatistics(int id);
        void AddMeetingParticipant(ParticipantAddRequest model);
        List<ChatStatsDaily> GetChatStatsDailyAndHost(int days, int host);
        List<ChatStatsDaily> GetChatStatsDaily(int days);
    }
}
