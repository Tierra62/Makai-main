using Sabio.Data.Providers;
using System.Collections.Generic;
using Sabio.Data;
using Sabio.Models.Requests.EmergencyContacts;
using System.Data.SqlClient;
using System.Data;
using Sabio.Models.Domain.EmergencyContacts;
using Sabio.Services.Interfaces;
using Sabio.Models;

namespace Sabio.Services.EmergencyContacts
{
    public class EmergencyContactService : IEmergencyContactService
    {
        IDataProvider _dataProvider = null;
        IBaseUserMapper _userMapper = null;

        public EmergencyContactService(IDataProvider dataProvider, IBaseUserMapper userMapper)
        {
            _dataProvider = dataProvider;
            _userMapper = userMapper;
        }
        #region GET methods
        public List<EmergencyContact> GetByUserId(int userId)
        {
            string procName = "[dbo].[EmergencyContacts_Select_ByUserId]";

            List<EmergencyContact> list = null;
            EmergencyContact contactService = null;

            _dataProvider.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@UserId", userId);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                contactService = MapSingleEmergContact(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<EmergencyContact>();
                }
                list.Add(contactService);
            });

            return list;
        }

        public Paged<EmergencyContactAdminView> GetByUserIdPaginated(int pageIndex, int pageSize, int userId)
        {
            Paged<EmergencyContactAdminView> pagedListOfEmergencyContacts = null;
            List<EmergencyContactAdminView> listOfEmergencyContacts = null;

            string procName = "[dbo].[EmergencyContacts_Select_ByUserId_Paginated]";
            int totalCount = 0;

            _dataProvider.ExecuteCmd(procName, (param) =>
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
                param.AddWithValue("@UserId", userId);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                EmergencyContactAdminView anEmergencyContact = MapSinglePagedEmergContact(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (listOfEmergencyContacts == null)
                {
                    listOfEmergencyContacts = new List<EmergencyContactAdminView>();
                }
                listOfEmergencyContacts.Add(anEmergencyContact);
            }
            );

            if (listOfEmergencyContacts != null)
            {
                pagedListOfEmergencyContacts = new Paged<EmergencyContactAdminView>(listOfEmergencyContacts, pageIndex, pageSize, totalCount);
            }
            return pagedListOfEmergencyContacts;
        }
        #endregion
        public int Add(EmergencyContactAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[EmergencyContacts_Insert]";

            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@userId", userId);
                
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int, 0);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });

            return id;
        }

        public void Update(EmergencyContactUpdateRequest model, int userId)
        {
            string procName = "[dbo].[EmergencyContacts_Update]";

            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@Id", model.Id);
                col.AddWithValue("@UserId", userId);

            }, returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[EmergencyContacts_Delete_ById]";

            _dataProvider.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);

            }, returnParameters: null);
        }
        #region mapper/private functions
        private static EmergencyContact MapSingleEmergContact(IDataReader reader, ref int startingIndex)
        {
            EmergencyContact aContact = new EmergencyContact();

            aContact.Id = reader.GetSafeInt32(startingIndex++);
            aContact.UserId = reader.GetSafeInt32(startingIndex++);
            aContact.Name = reader.GetSafeString(startingIndex++);
            aContact.PhoneNumber = reader.GetSafeString(startingIndex++);

            return aContact;

        }

        private EmergencyContactAdminView MapSinglePagedEmergContact(IDataReader reader, ref int startingIndex)
        {
            EmergencyContactAdminView anEmergencyContact = new EmergencyContactAdminView();

            anEmergencyContact.UserInfo = _userMapper.MapUser(reader, ref startingIndex);
            anEmergencyContact.Id = reader.GetSafeInt32(startingIndex++);
            anEmergencyContact.Name = reader.GetSafeString(startingIndex++);
            anEmergencyContact.PhoneNumber = reader.GetSafeString(startingIndex++);

            return anEmergencyContact;

        }

        private static void AddCommonParams(EmergencyContactAddRequest model, SqlParameterCollection col)
        {
            
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@PhoneNumber", model.PhoneNumber);

        }
        #endregion
    }
}
