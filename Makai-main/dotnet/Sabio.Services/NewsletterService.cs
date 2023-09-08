using Sabio.Models.Domain;
using Sabio.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Sabio.Data.Providers;
using Sabio.Models.Domain.Newsletters;
using Sabio.Data;
using System.Data;
using Sabio.Services.Interfaces;
using System.Data.SqlClient;
using Sabio.Models.Requests.Orders;
using Sabio.Models.Requests.Newsletter;
using Sabio.Models.Requests.Partners;
using Sabio.Models.Domain.Partners;
using Stripe.Terminal;

namespace Sabio.Services
{
    public class NewslettersService : INewslettersService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        public NewslettersService(IDataProvider data, IBaseUserMapper userMapper)
        {
            _data = data;
            _userMapper = userMapper;
        }

        public void UpdateNewsletter(NewsletterUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Newsletters_Update]";
            DataTable mappedTable = mapNewsletterContentToTableUpdate(model.ContentList);

            _data.ExecuteNonQuery(procName,
            inputParamMapper: delegate (SqlParameterCollection col)
            {
                
                AddCommonParamsUpdate(model, col, userId, mappedTable);
                col.AddWithValue("@Id", model.Id);
            },
            returnParameters: null);
        }





        public int AddNewsletter(NewsletterAddRequest model, int userId)
        {
            string procName = "[dbo].[Newsletters_Insert]";
            int id = 0;
            DataTable mappedTable = mapNewsletterContentToTable(model.ContentList);

            _data.ExecuteNonQuery(procName,
            inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col, userId, mappedTable);

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
        public void DeleteById(int id)
        {
            string procName = "[dbo].[Newsletters_Delete_ById]";
            _data.ExecuteNonQuery(procName,
               inputParamMapper: delegate (SqlParameterCollection col)
               {
                   col.AddWithValue("id", id);
               });
        }


        public Paged<Newsletter> GetAll(int pageIndex, int pageSize)
        {
            Paged<Newsletter> pagedList = null;
            List<Newsletter> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Newsletters_SelectAll]";

            _data.ExecuteCmd(
                procName, inputParamMapper: delegate (SqlParameterCollection param) 
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);

                },singleRecordMapper: delegate (IDataReader reader, short recordSetIndex) 
                {
                    int startingIndex = 0;
                    Newsletter newsletter = MapSingleNewsletter(reader, ref startingIndex);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }
                    if (list == null)
                    {
                        list = new List<Newsletter>();
                    }
                    list.Add(newsletter);
                    if (list != null)
                    {
                        pagedList = new Paged<Newsletter>(list, pageIndex, pageSize, totalCount);
                    }
                });
            return pagedList;
        }

        private DataTable mapNewsletterContentToTable(List<NewsletterContentAddRequest> contentToMap)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("Id", typeof(int));
            dt.Columns.Add("Content", typeof(string));

            foreach (NewsletterContentAddRequest singleContent in contentToMap)
            {
                DataRow dr = dt.NewRow();
                int startingIndex = 0;
                dr.SetField(startingIndex++, singleContent.TemplateKeyId);
                dr.SetField(startingIndex++, singleContent.Value);
                dt.Rows.Add(dr);
            }
            return dt;
        }

        private DataTable mapNewsletterContentToTableUpdate(List<NewsletterContentUpdateRequest> contentToMap)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("Id", typeof(int));
            dt.Columns.Add("Content", typeof(string));

            foreach (NewsletterContentUpdateRequest singleContent in contentToMap)
            {
                DataRow dr = dt.NewRow();
                int startingIndex = 0;
                dr.SetField(startingIndex++, singleContent.Id);
                dr.SetField(startingIndex++, singleContent.Value);
                dt.Rows.Add(dr);
            }
            return dt;
        }

        private void AddCommonParams(NewsletterAddRequest model, SqlParameterCollection col, int userId, DataTable mappedTable)
        {
            col.AddWithValue("@TemplateId", model.TemplateId);
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@CoverPhoto", model.CoverPhoto);
            col.AddWithValue("@DateToPublish", model.DateToPublish);
            col.AddWithValue("@DateToExpire", model.DateToExpire);
            col.AddWithValue("@CreatedBy", userId);
            col.AddWithValue("@BatchNewsletterContent", mappedTable);


        }

        private void AddCommonParamsUpdate(NewsletterUpdateRequest model, SqlParameterCollection col, int userId, DataTable mappedTable)
        {
            col.AddWithValue("@TemplateId", model.TemplateId);
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@CoverPhoto", model.CoverPhoto);
            col.AddWithValue("@DateToPublish", model.DateToPublish);
            col.AddWithValue("@DateToExpire", model.DateToExpire);
            col.AddWithValue("@CreatedBy", userId);
            col.AddWithValue("@BatchNewsletterContent", mappedTable);

        }

        private Newsletter MapSingleNewsletter(IDataReader reader, ref int startingIndex)
        {
            Newsletter aNewsletter = new Newsletter();

            aNewsletter.Id = reader.GetSafeInt32(startingIndex++);
            aNewsletter.TemplateId = reader.GetSafeInt32(startingIndex++);
            aNewsletter.NewslettersTemplateName = reader.GetSafeString(startingIndex++);
            aNewsletter.NewslettersTemplatePrimaryImage = reader.GetSafeString(startingIndex++);
            aNewsletter.Name = reader.GetSafeString(startingIndex++);
            aNewsletter.CoverPhoto = reader.GetSafeString(startingIndex++);
            aNewsletter.DateToPublish = reader.GetSafeDateTime(startingIndex++);
            aNewsletter.DateToExpire = reader.GetSafeDateTime(startingIndex++);
            aNewsletter.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aNewsletter.DateModified = reader.GetSafeDateTime(startingIndex++);
            aNewsletter.User = _userMapper.MapUser(reader, ref startingIndex);

            return aNewsletter;
        }


    }
}
