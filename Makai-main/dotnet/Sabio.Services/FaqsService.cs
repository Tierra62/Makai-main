using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Domain.FAQs;
using Sabio.Models.Requests.FAQs;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Sabio.Services.FAQs
{
    public class FaqsService : IFaqsService
    {
        IDataProvider _data = null;
        public FaqsService(IDataProvider data)
        {
            _data = data;
        }

        public void Update(FaqsUpdateRequest model, int userId)
        {
            string procName = "[dbo].[FAQs_Update]";

            _data.ExecuteNonQuery(procName,

            inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col, userId);

                col.AddWithValue("@Id", model.Id);

            },

            returnParameters: null);

        }
        public int Add(FaqsAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[FAQs_Insert]";

            _data.ExecuteNonQuery(procName,

            inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col, userId);

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
        public Faqs Get(int id)
        {

            string procName = "[dbo].[FAQs_SelectById]";

            Faqs faq = null;


            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {

                paramCollection.AddWithValue("@id", id);

            }, delegate (IDataReader reader, short set)
            {


                faq = MapSingleFaq(reader);

            }
            );

            return faq;
        }
        public List<Faqs> GetAllFaqs()
        {
            List<Faqs> list = null;
            string procName = "[dbo].[FAQs_SelectAll]";

            _data.ExecuteCmd(procName, null,
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    Faqs aFaq = MapSingleFaq(reader);

                    if (list == null)
                    {
                        list = new List<Faqs>();
                    }

                    list.Add(aFaq);
                }
            );

            return list;
        }
        private static Faqs MapSingleFaq(IDataReader reader)
        {
            Faqs aFaq = new Faqs();


            int startingIndex = 0;

            aFaq.Id = reader.GetSafeInt32(startingIndex++);
            aFaq.Question = reader.GetSafeString(startingIndex++);
            aFaq.Answer = reader.GetSafeString(startingIndex++);
            aFaq.FaqCategories = new LookUp();
            aFaq.FaqCategories.Id = reader.GetSafeInt32(startingIndex++);
            aFaq.FaqCategories.Name = reader.GetSafeString(startingIndex++);
            aFaq.SortOrder = reader.GetSafeInt32(startingIndex++);
            aFaq.DateCreated = reader.GetDateTime(startingIndex++);
            aFaq.DateModified = reader.GetDateTime(startingIndex++);
            aFaq.CreatedBy = reader.GetSafeInt32(startingIndex++);
            aFaq.ModifiedBy = reader.GetSafeInt32(startingIndex++);


            return aFaq;
        }
        private static void AddCommonParams(FaqsAddRequest model, SqlParameterCollection col, int userId)
        {
            col.AddWithValue("@Question", model.Question);
            col.AddWithValue("@Answer", model.Answer);
            col.AddWithValue("@CategoryId", model.CategoryId);
            col.AddWithValue("@SortOrder", model.SortOrder);
            col.AddWithValue("@CreatedBy", userId);
            col.AddWithValue("@ModifiedBy", userId);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[FAQs_DeleteById]";


            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            });
        }
    }
}
