using Newtonsoft.Json;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Requests.Partners;
using Sabio.Models.Domain.Partners;
using Sabio.Models.Domain;
using Sabio.Services.Interfaces;
using Sabio.Models.Domain.Stands;
using Sabio.Models.Domain.Recommendations;

namespace Sabio.Services
{
    public class PartnerService : IPartnerService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        public PartnerService(IDataProvider data, IBaseUserMapper userMapper)
        {          
            _data = data;
            _userMapper = userMapper;
        }

        public int Add(int userId, PartnerAddRequest request)
        {
            int id = 0;
            string procName = "[dbo].[Partners_Insert]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(request, col, userId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);

                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;

                    int.TryParse(oId.ToString(), out id);
                });

            return id;
        }

        public Partner Get(int id)
        {
            string procName = "[dbo].[Partners_SelectById]";

            Partner partner = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);
            },
            delegate (IDataReader reader, short set)
            {
                int index = 0;
                partner = MapSinglePartner(reader, ref index);
            }
            );
            return partner;
        }

        public void Update(int userId, PartnerUpdateRequest update)
        {

            string procName = "[dbo].[Partners_Update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {

                    AddCommonParams(update, col, userId);
                    col.AddWithValue("@Id", update.Id);

                },
                returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Partners_Delete]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@Id", id);
                });
        }

        public Paged<Partner> GetAllPaginated(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Partners_SelectAll_Paginated]";

            Paged<Partner> pagedList = null;
            List<Partner> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName,
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                },
                (reader, recordSetIndex) =>
                {
                    int index = 0;

                    Partner partner = MapSinglePartner(reader, ref index);
                    totalCount = reader.GetSafeInt32(index++);

                    if (list == null)
                    {
                        list = new List<Partner>();
                    }
                    list.Add(partner);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<Partner>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }

        public List<Partner> GetAll()
        {
            string procName = "[dbo].[Recommendations_SelectAll]";
            List<Partner> list = null;
            _data.ExecuteCmd(procName, inputParamMapper: null
            , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Partner aPartner = MapSinglePartner(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<Partner>();
                }
                list.Add(aPartner);
            });
            return list;
        }

        public Paged<Partner> SearchPaginated(int pageIndex, int pageSize, string query)
        {
            string procName = "[dbo].[Partners_Search]";

            Paged<Partner> pagedList = null;
            List<Partner> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName,
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@Query", query);
                },
                (reader, recordSetIndex) =>
                {

                    int index = 0;

                    Partner partner = MapSinglePartner(reader, ref index);
                    totalCount = reader.GetSafeInt32(index++);

                    if (list == null)
                    {
                        list = new List<Partner>();
                    }
                    list.Add(partner);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<Partner>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }

        public PartnerDetails GetDetails(int id)
        {
            string procName = "[dbo].[Partners_Select_ByIdDetails]";

            PartnerDetails partner = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);
            },
            delegate (IDataReader reader, short set)
            {
                int index = 0;
                partner = MapPartnerDetails(reader, ref index);
            }
            );
            return partner;
        }

        public Paged<PartnerDetails> GetAllDetails(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Partners_Select_AllDetails]";

            Paged<PartnerDetails> pagedList = null;
            List<PartnerDetails> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName,
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                },
                (reader, recordSetIndex) =>
                {
                    int index = 0;

                    PartnerDetails partner = MapPartnerDetails(reader, ref index);
                    totalCount = reader.GetSafeInt32(index++);

                    if (list == null)
                    {
                        list = new List<PartnerDetails>();
                    }
                    list.Add(partner);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<PartnerDetails>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }

        public Paged<PartnerDetails> SearchPaginatedDetails(int pageIndex, int pageSize, string query)
        {
            string procName = "[dbo].[Partners_Search_Details]";

            Paged<PartnerDetails> pagedList = null;
            List<PartnerDetails> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName,
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@Query", query);
                },
                (reader, recordSetIndex) =>
                {

                    int index = 0;

                    PartnerDetails partner = MapPartnerDetails(reader, ref index);
                    totalCount = reader.GetSafeInt32(index++);

                    if (list == null)
                    {
                        list = new List<PartnerDetails>();
                    }
                    list.Add(partner);
                }
                );
            if (list != null)
            {
                pagedList = new Paged<PartnerDetails>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }

        private void AddCommonParams(PartnerAddRequest request, SqlParameterCollection col, int userId)
        {
            col.AddWithValue("@Name", request.Name);
            col.AddWithValue("@Logo", request.Logo);
            col.AddWithValue("@BusinessPhone", request.BusinessPhone);
            col.AddWithValue("@SiteUrl", request.SiteUrl);
            col.AddWithValue("@CreatedBy", userId);
            col.AddWithValue("@IsActive", request.IsActive);
        }

        public Partner MapSinglePartner(IDataReader reader, ref int startingIndex)
        {
            Partner partner = new Partner();

            partner.Id = reader.GetSafeInt32(startingIndex++);
            partner.Name = reader.GetSafeString(startingIndex++);
            partner.Logo = reader.GetSafeString(startingIndex++);
            partner.BusinessPhone = reader.GetSafeString(startingIndex++);
            partner.SiteUrl = reader.GetSafeString(startingIndex++);

            partner.User = _userMapper.MapUser(reader, ref startingIndex);

            partner.DateCreated = reader.GetSafeDateTime(startingIndex++);
            partner.DateModified = reader.GetSafeDateTime(startingIndex++);
            partner.IsActive = reader.GetSafeBool(startingIndex++);

            return partner;
        }

        private PartnerDetails MapPartnerDetails(IDataReader reader, ref int startingIndex)
        {
            PartnerDetails partner = new PartnerDetails();

            partner.Id = reader.GetSafeInt32(startingIndex++);
            partner.Name = reader.GetSafeString(startingIndex++);
            partner.Logo = reader.GetSafeString(startingIndex++);
            partner.BusinessPhone = reader.GetSafeString(startingIndex++);
            partner.SiteUrl = reader.GetSafeString(startingIndex++);

            partner.User = _userMapper.MapUser(reader, ref startingIndex);

            partner.Stands = reader.DeserializeObject<List<Stand>>(startingIndex++);
            partner.Members = reader.DeserializeObject<List<Member>>(startingIndex++);

            partner.DateCreated = reader.GetSafeDateTime(startingIndex++);
            partner.DateModified = reader.GetSafeDateTime(startingIndex++);
            partner.IsActive = reader.GetSafeBool(startingIndex++);

            return partner;
        }

    }
}
