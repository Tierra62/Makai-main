using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.ExternalLinks;
using Sabio.Models.Requests.ExternalLinks;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class ExternalLinkService : IExternalLinkService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        ILookUpService _lookUpService ; 
        
        public ExternalLinkService(IDataProvider data, ILookUpService lookUpService, IBaseUserMapper userMapper )
        {
            _data = data;
            _lookUpService= lookUpService;
            _userMapper= userMapper;
        }
        public List<ExternalLink> GetByCreatorId(int creatorId)
        {
            string procName = "[dbo].[ExternalLinks_Select_ByCreatedBy]";
            List<ExternalLink> list = null;
           
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", creatorId);
            },
            delegate (IDataReader reader, short set)
            {
                int indexStart = 0;
                ExternalLink anExternalLink = MapSingleExternalLink(reader, ref indexStart);
                if (list == null)
                {
                    list = new List<ExternalLink>();
                }
                list.Add(anExternalLink);
            },
            returnParameters: null);
            return list;
        }
        public int Add(ExternalLinkAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[ExternalLinks_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@UserId", userId);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                Int32.TryParse(oId.ToString(), out id);
            });
            return id;
        }
        public void Update(ExternalLinkUpdateRequest model, int userId)
        {
            string procName = "[dbo].[ExternalLinks_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@Id", model.Id);
                col.AddWithValue("@UserId", userId);
            },
            returnParameters: null);
        }
        public void Delete(int id)
        {
            string procName = "[dbo].[ExternalLinks_Delete_ById]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            },
            returnParameters: null);
        }
        public ExternalLink GetById(int id)
        {
            string procName = "[dbo].[ExternalLinks_Select_ById]";
            ExternalLink eLink = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            },
            delegate (IDataReader reader, short set)
            {
                int indexStart = 0;
                eLink = MapSingleExternalLink(reader, ref indexStart);
            },
            returnParameters: null);
            return eLink;
        }
        private ExternalLink MapSingleExternalLink(IDataReader reader, ref int indexStart)
        {
            ExternalLink anExternalLink = new ExternalLink();
            anExternalLink.Id = reader.GetSafeInt32(indexStart++);
            anExternalLink.UrlType = _lookUpService.MapSingleLookUp(reader, ref indexStart);
            anExternalLink.Url = reader.GetSafeString(indexStart++);
            anExternalLink.EntityId = reader.GetSafeInt32(indexStart++);
            anExternalLink.EntityType =  _lookUpService.MapSingleLookUp(reader, ref indexStart);
            anExternalLink.User = _userMapper.MapUser(reader, ref indexStart);
            return anExternalLink;
        }
        private static void AddCommonParams(ExternalLinkAddRequest model, SqlParameterCollection collection)
        {
            collection.AddWithValue("@UrlTypeId", model.UrlTypeId);
            collection.AddWithValue("@Url", model.Url);
            collection.AddWithValue("@EntityId", model.EntityId);
            collection.AddWithValue("@EntityTypeId", model.EntityTypeId);
        }
    }
}