using Sabio.Data.Providers;
using Sabio.Models.Requests.Newsletter;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Data;
using Sabio.Models.Domain.Newsletters;
using Sabio.Models;
using Stripe.Terminal;
using Sabio.Models.Domain;
using Newtonsoft.Json;

namespace Sabio.Services
{
    public class NewsletterTemplateService : INewsletterTemplateService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        ILookUpService _lookUpService = null;
        public NewsletterTemplateService(IDataProvider data, IBaseUserMapper userMapper, ILookUpService lookUpService)
        {
            _data = data;
            _userMapper = userMapper;
            _lookUpService = lookUpService;
        }

        public void DeleteById(int id)
        {
            string procName = "[dbo].[NewslettersTemplates_Delete_ById]";
            _data.ExecuteNonQuery(procName,
               inputParamMapper: delegate (SqlParameterCollection col)
               {
                   col.AddWithValue("id", id);
               });
        }

        public void UpdateNewsletterTemplate(NewsletterTemplateUpdateRequest model, int userId)
        {
            string procName = "[dbo].[NewsletterTemplates_Update]";

            _data.ExecuteNonQuery(procName,
            inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", model.Id);
                AddCommonParams(model, col, userId);
            },
            returnParameters: null);
        }


        public int AddNewsletterTemplate(NewsletterTemplateAddRequest model, int userId)
        {
            string procName = "[dbo].[NewsletterTemplates_Insert]";
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

        public Paged<NewsletterTemplate> GetAll(int pageIndex, int pageSize)
        {
            Paged<NewsletterTemplate> pagedList = null;
            List<NewsletterTemplate> list = null;
            int totalCount = 0;
            string procName = "[dbo].[NewslettersTemplates_SelectAll]";

            _data.ExecuteCmd(

                procName ,inputParamMapper: delegate (SqlParameterCollection param) 
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate ( IDataReader reader, short recordSetIndex)
                {
                    int startingIndex = 0;
                    NewsletterTemplate aNewsletterTemplate = MapSingleNewsletterTemplate(reader, ref startingIndex);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }
                    if (list == null)
                    {
                        list = new List<NewsletterTemplate>();
                    }
                    list.Add(aNewsletterTemplate);
                    if (list != null)
                    {
                        pagedList = new Paged<NewsletterTemplate>(list, pageIndex, pageSize, totalCount);
                    }
                });
            return pagedList;
        }


        private void AddCommonParams(NewsletterTemplateAddRequest model, SqlParameterCollection col, int userId)
        {
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@PrimaryImage", model.PrimaryImage);
            col.AddWithValue("@CreatedBy", userId);

        }

        private NewsletterTemplate MapSingleNewsletterTemplate(IDataReader reader, ref int startingIndex)
        {
            NewsletterTemplate aNewsletterTemplate = new NewsletterTemplate();
            aNewsletterTemplate.Id = reader.GetInt32(startingIndex++);
            aNewsletterTemplate.Name = reader.GetString(startingIndex++);
            aNewsletterTemplate.Description = reader.GetString(startingIndex++);
            aNewsletterTemplate.PrimaryImage = reader.GetString(startingIndex++);
            aNewsletterTemplate.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aNewsletterTemplate.DateModified = reader.GetSafeDateTime(startingIndex++);
            aNewsletterTemplate.User = _userMapper.MapUser(reader, ref startingIndex);



            string templateDataString = reader.GetSafeString(startingIndex++);
            if (!string.IsNullOrEmpty(templateDataString))
            {
                aNewsletterTemplate.TemplateDataList = JsonConvert.DeserializeObject<List<TemplateData>>(templateDataString);
            }
            return aNewsletterTemplate;
        }

    }
}
