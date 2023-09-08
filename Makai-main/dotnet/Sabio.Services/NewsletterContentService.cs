using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain.Newsletters;
using Sabio.Models.Requests.Newsletter;
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
    public class NewsletterContentService : INewsletterContentService
    {

        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        ILookUpService _lookupService = null;
        public NewsletterContentService(IDataProvider data, IBaseUserMapper userMapper, ILookUpService lookUpService)
        {
            _data = data;
            _userMapper = userMapper;
            _lookupService = lookUpService;
        }

        public void DeleteById(int id)
        {
            string procName = "[dbo].[NewsletterContent_Delete_ById]";
            _data.ExecuteNonQuery(procName,
               inputParamMapper: delegate (SqlParameterCollection col)
               {
                   col.AddWithValue("id", id);
               });
        }

        public List<NewsletterContent> GetByNewsletterId(int id)
        {
            string procName = "[dbo].[NewsletterContent_Select_ByNewsletterId]";
            
            List<NewsletterContent> list = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                NewsletterContent aNewsletterContent = null;
                
                aNewsletterContent = MapSingleNewsletterContent(reader, ref startingIndex);
                if (list == null)
                {
                    list = new List<NewsletterContent>();
                }
                list.Add(aNewsletterContent);

            }) ;
            return list;
        }

        public void Update(NewsletterContentUpdateRequest model, int userId)
        {
            string procName = "[dbo].[NewsletterContent_Update]";

            _data.ExecuteNonQuery(procName,
            inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", model.Id);
                AddCommonParams(model, col, userId);
            },
            returnParameters: null);
        }

        public int Add(NewsletterContentAddRequest model, int userId)
        {
            string procName = "[dbo].[NewsletterContent_Insert]";
            int id = 0;

            _data.ExecuteNonQuery(procName,
            inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col, userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oldId = returnCollection["@Id"].Value;
                int.TryParse(oldId.ToString(), out id);
            });

            return id;
        }

        private NewsletterContent MapSingleNewsletterContent(IDataReader reader, ref int startingIndex)
        {
            NewsletterContent aNewsletterContent = new NewsletterContent();

            aNewsletterContent.NewsletterContentId = reader.GetInt32(startingIndex++);
            aNewsletterContent.TemplateKeyId = reader.GetInt32( startingIndex++);
            aNewsletterContent.KeyTypeName = reader.GetString( startingIndex++);
            aNewsletterContent.TemplateName = reader.GetString( startingIndex++);
            aNewsletterContent.TemplateDescription = reader.GetString( startingIndex++);
            aNewsletterContent.NewsletterId = reader.GetInt32( startingIndex++);
            aNewsletterContent.NewsletterCoverPhoto = reader.GetString( startingIndex++);
            aNewsletterContent.NewsletterName = reader.GetString( startingIndex++);
            aNewsletterContent.KeyName = reader.GetString( startingIndex++);
            aNewsletterContent.KeyType =_lookupService.MapSingleLookUp(reader, ref startingIndex);
            aNewsletterContent.Value = reader.GetString( startingIndex++);
            aNewsletterContent.DateCreated = reader.GetSafeDateTime( startingIndex++);
            aNewsletterContent.DateModified = reader.GetSafeDateTime( startingIndex++);
            aNewsletterContent.User = _userMapper.MapUser(reader, ref startingIndex);

            return aNewsletterContent;
        }

        private void AddCommonParams(NewsletterContentAddRequest model, SqlParameterCollection col, int userId)
        {
            col.AddWithValue("@TemplateKeyId", model.TemplateKeyId);
            col.AddWithValue("@Value", model.Value);
            col.AddWithValue("@CreatedBy", userId);
        }

        private void AddCommonParams(NewsletterContentUpdateRequest model, SqlParameterCollection col, int userId)
        {
            col.AddWithValue("@TemplateKeyId", model.Id);
            col.AddWithValue("@Value", model.Value);
            col.AddWithValue("@CreatedBy", userId);
        }

    }
}
