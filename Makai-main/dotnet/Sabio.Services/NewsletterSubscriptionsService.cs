using Sabio.Data.Providers;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using Sabio.Models.Requests;
using Sabio.Data;
using Sabio.Models.Domain;
using Sabio.Models.Interfaces;
using Sabio.Models;

namespace Sabio.Services
{
    public class NewsletterSubscriptionsService : INewsletterSubscriptionsService
    {
        IDataProvider _data = null;
        public NewsletterSubscriptionsService(IDataProvider data) 
        {
            _data = data;
        }
        public void Update(NewsletterSubscriptionUpdateRequest model)
        {
            string procName = "[dbo].[NewsletterSubscriptions_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Email", model.Email);
                col.AddWithValue("@IsSubscribed", model.IsSubscribed);

            },
            returnParameters: null);
        }
        public void Add(NewsletterSubscriptionAddRequest model )
        {        
            string procName = "[dbo].[NewsletterSubscriptions_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Email", model.Email);
            },
            returnParameters: null);          
        }
        public NewsletterSubscription Get(string subscriber)
        {
            string procName = "[dbo].[NewsletterSubscriptions_Select_ByEmail]";

            NewsletterSubscription newslettersubscriptions = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Email", subscriber);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                newslettersubscriptions = MapSingleNewsletterSubscription(reader, ref startingIndex);
            }
            );
            return newslettersubscriptions;
        }
        public Paged<NewsletterSubscription> GetAll(int pageIndex, int pageSize)
        {
            Paged<NewsletterSubscription> pagedList = null;
            List<NewsletterSubscription> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                "[dbo].[NewsletterSubscriptions_SelectAll]", (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);

                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    NewsletterSubscription newsletterSubscriptions = MapSingleNewsletterSubscription(reader, ref startingIndex);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }
                    if (list == null)
                    {
                        list = new List<NewsletterSubscription>();
                    }
                    list.Add(newsletterSubscriptions);
                    if (list != null)
                    {
                        pagedList = new Paged<NewsletterSubscription>(list, pageIndex, pageSize, totalCount);
                    }
                });
            return pagedList;
        }
        public Paged<NewsletterSubscription> GetAllSubscribed(int pageIndex, int pageSize)
        {
            Paged<NewsletterSubscription> pagedList = null;
            List<NewsletterSubscription> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                "[dbo].[NewsletterSubscriptions_SelectAll_Subscribed]", (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);

                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    NewsletterSubscription newsletterSubscriptions = MapSingleNewsletterSubscription(reader, ref startingIndex);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }
                    if (list == null)
                    {
                        list = new List<NewsletterSubscription>();
                    }
                    list.Add(newsletterSubscriptions);
                    
                });
                if (list != null)
                {
                    pagedList = new Paged<NewsletterSubscription>(list, pageIndex, pageSize, totalCount);
                }
            return pagedList;
        }
        public Paged<NewsletterSubscription> GetAllNotSubscribed(int pageIndex, int pageSize)
        {
            Paged<NewsletterSubscription> pagedList = null;
            List<NewsletterSubscription> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                "[dbo].[NewsletterSubscriptions_SelectAll_NotSubscibed]", (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);

                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    NewsletterSubscription newsletterSubscriptions = MapSingleNewsletterSubscription(reader, ref startingIndex);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }
                    if (list == null)
                    {
                        list = new List<NewsletterSubscription>();
                    }
                    list.Add(newsletterSubscriptions);
                    
                });
                if (list != null)
                    {
                        pagedList = new Paged<NewsletterSubscription>(list, pageIndex, pageSize, totalCount);
                    }
            return pagedList;
        }
        private static NewsletterSubscription MapSingleNewsletterSubscription(IDataReader reader, ref int startingIndex)
        {
            NewsletterSubscription aNewsletterSubscription = new NewsletterSubscription();

            aNewsletterSubscription.Email = reader.GetSafeString(startingIndex++);
            aNewsletterSubscription.IsSubscribed = reader.GetSafeBool(startingIndex++);
            aNewsletterSubscription.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aNewsletterSubscription.DateModified = reader.GetSafeDateTime(startingIndex++);

            return aNewsletterSubscription;
        }

    }
}
