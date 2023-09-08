using Newtonsoft.Json.Bson;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.LoginLog;
using Sabio.Models.Domain.Metrics;
using Sabio.Models.Requests.Users;
using System.Security.Principal;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public interface IUserService
    {
        int Create(object userModel);
        User GetById(int id);
        Paged<User> GetAll(int pageIndex, int pageSize);
        Paged<User> GetAllByUserName(int pageIndex, int pageSize, string query);
        int GetUserIdByEmail(string email);
        int LogUserLogin(string email, string ipAddress, int userId);
        Paged<LoginLog> LoginLogGetByUserId(int pageIndex, int pageSize, int userId);
        int Add(UserAddRequest model);
        void Update(UserUpdateRequest model);
        void UpdateStatus(int id, int statusId);
        void Update2FA(int id, bool twoFA);
        void UpdateConfirmed(string email, string token);
        void ChangePassword(ChangePassword model);
        void AddToken(string token, int userId, int tokenType);
        void AddResetToken(string email, string token, int tokenType);
        void DeleteToken(string token);
        Task<bool> LogInAsync(string email, string password);
        Task<bool> LogInTest(string email, string password, int id, string[] roles = null);
        Paged<User> SearchPaginated(int pageIndex, int pageSize, string query);
        Paged<User> SearchPaginatedFiltered(int pageIndex, int pageSize, string query, int statusId);
        DashboardMetric GetMetrics();
        void ChangePasswordV2(int userId, ChangePasswordV2 model);
        void UpdateEmail(int userId, UserEmailUpdateRequest model);
    }
}