using Amazon.Runtime;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Bson;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.EmergencyContacts;
using Sabio.Models.Domain.LoginLog;
using Sabio.Models.Domain.LoyaltyPoints;
using Sabio.Models.Domain.Metrics;
using Sabio.Models.Enums;
using Sabio.Models.Requests.Users;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net.NetworkInformation;
using System.Reflection;
using System.Runtime.ExceptionServices;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Sabio.Services
{
    public class UserService : IUserService, IBaseUserMapper
    {

        private IAuthenticationService<int> _authenticationService;
        private IDataProvider _dataProvider;

        public UserService(IAuthenticationService<int> authSerice, IDataProvider dataProvider)
        {
            _authenticationService = authSerice;
            _dataProvider = dataProvider;
        }

        public User GetById(int id)
        {
            User user = null;

            string procName = "[dbo].[Users_SelectById]";

            _dataProvider.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {

                col.AddWithValue("@Id", id);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {

                int startingIndex = 0;

                user = MapSingleUser(reader, ref startingIndex);

            });

            return user;

        }

        public Paged<User> GetAll(int pageIndex, int pageSize)
        {
            Paged<User> pagedResult = null;

            List<User> users = new List<User>();

            int totalCount = 0;

            string procName = "[dbo].[Users_SelectAll_Paginated]";

            _dataProvider.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {

                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);

            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {

                int startingIndex = 0;

                User user = MapSingleUser(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (users == null)
                {
                    users = new List<User>();
                }

                users.Add(user);

            });

            if (users != null)
            {
                pagedResult = new Paged<User>(users, pageIndex, pageSize, totalCount);
            }

            return pagedResult;

        }

        public Paged<User> GetAllByUserName(int pageIndex, int pageSize, string query)
        {
            Paged<User> pagedListOfUsers = null;
            List<User> listOfUsers = null;

            string procName = "[dbo].[Users_SelectAll_ByUserName_Paginated]";
            int totalCount = 0;

            _dataProvider.ExecuteCmd(procName, (param) =>
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
                param.AddWithValue("@Query", query);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                User aUser = MapSingleUser(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (listOfUsers == null)
                {
                    listOfUsers = new List<User>();
                }
                listOfUsers.Add(aUser);
            }
            );

            if (listOfUsers != null)
            {
                pagedListOfUsers = new Paged<User>(listOfUsers, pageIndex, pageSize, totalCount);
            }
            return pagedListOfUsers;
        }

        public int GetUserIdByEmail(string email)
        {
            int userId = 0;
            string procName = "[dbo].[Users_SelectAuthData]";
            _dataProvider.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Email", email);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                userId = reader.GetSafeInt32(startingIndex++);
            });
            return userId;
        }

        public int LogUserLogin(string email, string ipAddress, int userId)
        {
            int id = 0;

            string procName = "[dbo].[UserLogin_Insert]";
            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Email", email);
                col.AddWithValue("@IPAddress", ipAddress);
                col.AddWithValue("@UserId", userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCol)
            {
                object oId = returnCol["@Id"].Value;
                Int32.TryParse(oId.ToString(), out id);
            });

            return id;
        }

        public Paged<LoginLog> LoginLogGetByUserId(int pageIndex, int pageSize, int userId)
        {
            Paged<LoginLog> pagedListOfLogin = null;
            List<LoginLog> list = null;
            string procName = "[dbo].[UserLogins_SelectByUserId_Paginated]";
            int totalCount = 0;

            _dataProvider.ExecuteCmd(
                procName
                , inputParamMapper: delegate (SqlParameterCollection param)
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@UserId", userId);
                }, singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    LoginLog loginlog = MapSingleLoginLog(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }
                    if (list == null)
                    {
                        list = new List<LoginLog>();
                    }
                    list.Add(loginlog);
                });
            if (list != null)
            {
                pagedListOfLogin = new Paged<LoginLog>(list, pageIndex, pageSize, totalCount);
            }
            return pagedListOfLogin;

        }
        public int Add(UserAddRequest model)
        {
            int id = 0;

            string procName = "[dbo].[Users_Insert]";

            string password = model.Password;
            string salt = BCrypt.BCryptHelper.GenerateSalt();
            string hashedPassword = BCrypt.BCryptHelper.HashPassword(password, salt);


            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
                {

                    AddCommonParams(model, hashedPassword, col);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);

                }, returnParameters: delegate (SqlParameterCollection returnCollection)
                {

                    object oId = returnCollection["@Id"].Value;
                    Int32.TryParse(oId.ToString(), out id);

                });

            return id;

        }

        public void Update(UserUpdateRequest model)
        {
            string procName = "[dbo].[Users_Update]";


            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddUpdateParams(model, col);
            }, returnParameters: null);

        }

        public void UpdateStatus(int id, int statusId)
        {

            string procName = "[dbo].[Users_UpdateStatus]";

            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {

                col.AddWithValue("@Id", id);
                col.AddWithValue("@StatusId", statusId);

            }, returnParameters: null);
        }
        
        public void UpdateConfirmed(string email, string token)
        {
            string procName = "[dbo].[Users_Confirm]";

            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {

                col.AddWithValue("@Email", email);
                col.AddWithValue("@Token", token);

            }, returnParameters: null);
        }

        public void Update2FA(int id, bool twoFA)
        {
            string procName = "[dbo].[Users_Update2FA]";

            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {

                col.AddWithValue("@Id", id);
                col.AddWithValue("@Bool2FA", twoFA);

            }, returnParameters: null);
        }

        public void ChangePassword(ChangePassword model)
        {
            string procName = "[dbo].[Users_UpdatePassword]";

            string newPassword = model.Password;
            string salt = BCrypt.BCryptHelper.GenerateSalt();
            string hashedPassword = BCrypt.BCryptHelper.HashPassword(newPassword, salt);

            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {

                col.AddWithValue("@Email", model.Email);
                col.AddWithValue("@Token", model.Token);
                col.AddWithValue("@Password", hashedPassword);

            }, returnParameters: null);
        }

        public void ChangePasswordV2(int userId, ChangePasswordV2 model)
        {

            string getPasswordProcName = "[dbo].[Users_SelectPasswordById]";
            string currentPasswordHashed = null;

            _dataProvider.ExecuteCmd(getPasswordProcName, inputParamMapper: delegate (SqlParameterCollection inputParams)
            {
                inputParams.AddWithValue("@Id", userId);
            },
            singleRecordMapper: delegate(IDataReader reader, short set){
                int starting = 0;
                currentPasswordHashed = reader.GetSafeString(starting++);
            });

            string currentPasswordInput = model.CurrentPassword;
            bool currentPasswordConfirmed = BCrypt.BCryptHelper.CheckPassword(currentPasswordInput, currentPasswordHashed);
            if (currentPasswordConfirmed)
            {
                string procName = "[dbo].[Users_UpdatePasswordV2]";

                string newPassword = model.Password;
                string salt = BCrypt.BCryptHelper.GenerateSalt();
                string hashedPassword = BCrypt.BCryptHelper.HashPassword(newPassword, salt);

                _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@UserId", userId);
                    col.AddWithValue("@Password", hashedPassword);
                }, returnParameters: null);
            }
            else
            {
                throw new Exception("Current Password is incorrect. Please enter another password to try again.");
            }
        }

        public void UpdateEmail(int userId, UserEmailUpdateRequest model)
        {
            string getPasswordProcName = "[dbo].[Users_SelectPasswordById]";
            string currentPasswordHashed = null;

            _dataProvider.ExecuteCmd(getPasswordProcName, inputParamMapper: delegate (SqlParameterCollection inputParams)
            {
                inputParams.AddWithValue("@Id", userId);
            },
            singleRecordMapper: delegate (IDataReader reader, short set) {
                int starting = 0;
                currentPasswordHashed = reader.GetSafeString(starting++);
            });

            string currentPasswordInput = model.CurrentPassword;
            bool currentPasswordConfirmed = BCrypt.BCryptHelper.CheckPassword(currentPasswordInput, currentPasswordHashed);

            if (currentPasswordConfirmed)
            {

                string procName = "[dbo].[Users_UpdateEmail]";
                _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", userId);
                    col.AddWithValue("@Email", model.Email);
                }, returnParameters: null);

            }
            else {
                throw new Exception("Current Password is incorrect. Please enter another password to try again.");
            }
        }

        #region Tokens
        public void AddToken(string token, int userId, int tokenType)
        {

            string procName = "[UserTokens_Insert]";

            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {

                AddTokenParams(token, userId, tokenType, col);

            }, returnParameters: null);

        }

        public void AddResetToken(string email, string token, int tokenType)
        {

            string procName = "[dbo].[UserTokens_InsertResetPassword]";

            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {

                AddResetTokenParams(email, token, tokenType, col);

            }, returnParameters: null);
        }

        public void DeleteToken(string token)
        {

            string procName = "[dbo].[UserTokens_Delete_ByToken]";

            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {

                col.AddWithValue("@Token", token);

            }, returnParameters: null);
        }
        #endregion

        public async Task<bool> LogInAsync(string email, string password)
        {
            bool isSuccessful = false;

                IUserAuthData response = Get(email, password);

                if (response != null)
                {
                    await _authenticationService.LogInAsync(response);
                    isSuccessful = true;
                }

            return isSuccessful;
        }

        public async Task<bool> LogInTest(string email, string password, int id, string[] roles = null)
        {
            bool isSuccessful = false;
            var testRoles = new[] { "User", "Super", "Content Manager" };

            var allRoles = roles == null ? testRoles : testRoles.Concat(roles);

            IUserAuthData response = new UserBase
            {
                Id = id
                ,
                Name = email
                ,
                Roles = allRoles
                ,
                TenantId = "Acme Corp UId"
            };

            Claim fullName = new Claim("CustomClaim", "Sabio Bootcamp");
            await _authenticationService.LogInAsync(response, new Claim[] { fullName });

            return isSuccessful;
        }

        public Paged<User> SearchPaginated(int pageIndex, int pageSize, string query)
        {
            Paged<User> pagedList = null;
            List<User> list = null;
            int totalCount = 0;

            _dataProvider.ExecuteCmd(
                "dbo.UsersAdmin_SearchPaginate",
                (param) =>
                {
                    AddCommonPaginationParams(pageIndex, pageSize, query, param);

                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    User user = MapSingleUser(reader, ref startingIndex);
                    if (totalCount == 0) {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }
                    if (list == null)
                    {
                        list = new List<User>();
                    }
                    list.Add(user);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<User>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public DashboardMetric GetMetrics()
        {
            DashboardMetric metric = null;
            List<UserStatus> statusMetrics = null;
            UserGrowth userGrowth = null;
            RevenueGrowth revenueGrowth = null;
            string procName = "[dbo].[UsersAdmin_SelectMetrics]";
            _dataProvider.ExecuteCmd(procName, inputParamMapper: null,
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    if (set == 0)
                    {
                        int starting = 0;
                        UserStatus currentStatus = new UserStatus();
                        currentStatus.Status = reader.GetSafeString(starting++);
                        currentStatus.NumberOfUsers = reader.GetSafeInt32(starting++);
                        if (statusMetrics == null)
                        {
                            statusMetrics = new List<UserStatus>();
                        }
                        statusMetrics.Add(currentStatus);
                    }
                    else if (set == 1)
                    {
                        int starting = 0;
                        userGrowth = new UserGrowth();
                        userGrowth.WeeklyGrowth = reader.GetSafeDecimal(starting++);
                        userGrowth.MonthlyGrowth = reader.GetSafeDecimal(starting++);
                        userGrowth.YearlyGrowth = reader.GetSafeDecimal(starting++);
                    }
                    else if (set == 2)
                    {
                        int starting = 0;
                        revenueGrowth = new RevenueGrowth();
                        revenueGrowth.RevenueLastWeek = reader.GetSafeInt32(starting++);
                        revenueGrowth.RevenueLastMonth = reader.GetSafeInt32(starting++);
                        revenueGrowth.RevenueLastYear = reader.GetSafeInt32(starting++);
                        revenueGrowth.RevenueGrowthLastWeek = reader.GetSafeDecimal(starting++);
                        revenueGrowth.RevenueGrowthLastMonth = reader.GetSafeDecimal(starting++);
                        revenueGrowth.RevenueGrowthLastYear = reader.GetSafeDecimal(starting++);
                        revenueGrowth.RevenueGrowthLastWeekOnYear = reader.GetSafeDecimal(starting++);
                        revenueGrowth.RevenueGrowthLastMonthOnYear = reader.GetSafeDecimal(starting++);
                    }
                });
            if (statusMetrics != null && userGrowth != null && revenueGrowth != null)
            {
                metric = new DashboardMetric();
                metric.UserStatusMetrics = statusMetrics;
                metric.UserGrowth = userGrowth;
                metric.RevenueGrowth = revenueGrowth;
            }
            return metric;
        }

        public Paged<User> SearchPaginatedFiltered (int pageIndex, int pageSize, string query, int statusId)
        {
            Paged<User> pagedItems = null;
            List<User> list = null;
            string procName = "[dbo].[UsersAdmin_SearchPaginateFilter]";
            int totalCount = 0;
            _dataProvider.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection inputParams)
                {
                    AddCommonPaginationParams(pageIndex, pageSize, query, inputParams);
                    inputParams.AddWithValue("@StatusId", statusId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int starting = 0;
                    User user = MapSingleUser(reader, ref starting);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(starting);
                    }
                    if (list == null)
                    {
                        list = new List<User>();
                    }
                    list.Add(user);
                });
            if (list != null)
            {
                pagedItems = new Paged<User>(list, pageIndex, pageSize, totalCount);
            }
            return pagedItems;
        }


        public int Create(object userModel)
        {
            //make sure the password column can hold long enough string. put it to 100 to be safe

            int userId = 0;
            string password = "Get from user model when you have a concreate class";
            string salt = BCrypt.BCryptHelper.GenerateSalt();
            string hashedPassword = BCrypt.BCryptHelper.HashPassword(password, "");

            //DB provider call to create user and get us a user id

            //be sure to store both salt and passwordHash
            //DO NOT STORE the original password value that the user passed us

            return userId;
        }

        /// <summary>
        /// Gets the Data call to get a give user
        /// </summary>
        /// <param name="email"></param>
        /// <param name="passwordHash"></param>
        /// <returns></returns>
        private IUserAuthData Get(string email, string password)
        {
            string passwordFromDb = "";
            UserBase user = null;

            string procName = "[dbo].[Users_SelectAuthDataV2]";
            int startingIndex = 0;

            _dataProvider.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Email", email);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {

                user = MapUserAuthData(reader, ref startingIndex);
                passwordFromDb = reader.GetSafeString(startingIndex++);

            });

            bool isValidCredentials = BCrypt.BCryptHelper.CheckPassword(password, passwordFromDb);

            if (isValidCredentials == true)
            {
                bool emailConfirmed = false;
                int starting = 0;
                _dataProvider.ExecuteCmd("[dbo].[Users_SelectIsConfirmed]", inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Email", email);
                }, singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    emailConfirmed = reader.GetSafeBool(starting++);
                });
                if (!emailConfirmed)
                {
                    throw new Exception("Email is not confirmed");
                }
            }
            else
            {
                user = null;
            }
            return user;
        }

        #region private methods
        private static void AddCommonParams(UserAddRequest model, string password, SqlParameterCollection col)
        {
            col.AddWithValue("@Email", model.Email);
            col.AddWithValue("@Phone", model.Phone);
            col.AddWithValue("@FirstName", model.FirstName);
            col.AddWithValue("@LastName", model.LastName);
            col.AddWithValue("@Mi", model.Mi);
            col.AddWithValue("@Password", password);
            col.AddWithValue("@DOB", model.DOB);
            col.AddWithValue("@RoleId", model.RoleId);
        }

        private static void AddUpdateParams(UserUpdateRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Id", model.Id);
            col.AddWithValue("@Phone", model.Phone);
            col.AddWithValue("@FirstName", model.FirstName);
            col.AddWithValue("@LastName", model.LastName);
            col.AddWithValue("@Mi", model.Mi);
            col.AddWithValue("@AvatarUrl", model.AvatarUrl);
            col.AddWithValue("@DOB", model.DOB);
        }

        private static void AddCommonPaginationParams(int pageIndex, int pageSize, string query, SqlParameterCollection param)
        {
            param.AddWithValue("@PageIndex", pageIndex);
            param.AddWithValue("@PageSize", pageSize);
            param.AddWithValue("@Query", query);
        }

        private static void AddTokenParams(string token, int userId, int tokenType, SqlParameterCollection col)
        {
            col.AddWithValue("@Token", token);
            col.AddWithValue("@UserId", userId);
            col.AddWithValue("@TokenType", tokenType);
        }
        private static void AddResetTokenParams(string email, string token, int tokenType, SqlParameterCollection col)
        {
            col.AddWithValue("@Email", email);
            col.AddWithValue("@Token", token);
            col.AddWithValue("@TokenType", tokenType);
        }

        #endregion

        #region Mappers
        private static User MapSingleUser(IDataReader reader, ref int startingIndex)
        {
            User user = new User();
            user.Roles = new List<LookUp>();
            user.StatusType = new LookUp();

            user.Id = reader.GetSafeInt32(startingIndex++);
            user.Email = reader.GetSafeString(startingIndex++);
            user.Phone = reader.GetSafeString(startingIndex++);
            user.FirstName = reader.GetSafeString(startingIndex++);
            user.LastName = reader.GetSafeString(startingIndex++);
            user.Mi = reader.GetSafeString(startingIndex++);
            user.AvatarUrl = reader.GetSafeString(startingIndex++);
            user.DOB = reader.GetSafeDateTime(startingIndex++);
            user.Roles = reader.DeserializeObject<List<LookUp>>(startingIndex++);
            user.StatusType.Id = reader.GetSafeInt32(startingIndex++);
            user.StatusType.Name = reader.GetSafeString(startingIndex++);
            user.Is2FA = reader.GetSafeBool(startingIndex++);
            return user;
        }

        private LoginLog MapSingleLoginLog(IDataReader reader, ref int startingIndex)
        {
            LoginLog loginLog = new LoginLog();
            loginLog.Id = reader.GetSafeInt32(startingIndex++);
            loginLog.User = MapUser(reader, ref startingIndex);
            loginLog.Email = reader.GetSafeString(startingIndex++);
            loginLog.IPAddress = reader.GetSafeString(startingIndex++);
            loginLog.DateLoggedIn = reader.GetSafeDateTime(startingIndex++);
            return loginLog;
        }

        private static UserBase MapUserAuthData(IDataReader reader, ref int startingIndex)
        {
            UserBase userAuthData = new UserBase();

            userAuthData.Id = reader.GetSafeInt32(startingIndex++);
            userAuthData.Name = reader.GetSafeString(startingIndex++);
            List<LookUp> roles = reader.DeserializeObject<List<LookUp>>(startingIndex++);
            userAuthData.Roles = roles.Select(x => x.Name).ToList();
            userAuthData.TenantId = "Makai415";

            return userAuthData;
        }

        private static UserToken MapUserToken(IDataReader reader)
        {

            UserToken userToken = new UserToken();
            userToken.TokenType = new LookUp();

            int startingIndex = 0;
            userToken.Token = reader.GetSafeString(startingIndex++);
            userToken.UserId = reader.GetSafeInt32(startingIndex++);
            userToken.TokenType.Id = reader.GetSafeInt32(startingIndex++);
            userToken.TokenType.Name = reader.GetSafeString(startingIndex++);
            return userToken;

        }

        public BaseUser MapUser(IDataReader reader, ref int startingIndex)
        {

            BaseUser user = new BaseUser();
            user.Id = reader.GetSafeInt32(startingIndex++);
            user.FirstName = reader.GetSafeString(startingIndex++);
            user.LastName = reader.GetSafeString(startingIndex++);
            user.Mi = reader.GetSafeString(startingIndex++);
            user.AvatarUrl = reader.GetSafeString(startingIndex++);
            return user;
        }
        #endregion

    }
}