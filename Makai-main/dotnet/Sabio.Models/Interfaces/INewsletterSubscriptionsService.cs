using Sabio.Models.AppSettings;
using Sabio.Models.Domain;
using Sabio.Models.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Interfaces
{
    public interface INewsletterSubscriptionsService
    {
        NewsletterSubscription Get(string subscriber);
        Paged<NewsletterSubscription> GetAll(int pageIndex, int pageSize);
        Paged<NewsletterSubscription> GetAllSubscribed(int pageIndex, int pageSize);
        Paged<NewsletterSubscription> GetAllNotSubscribed(int pageIndex, int pageSize);
        void Update(NewsletterSubscriptionUpdateRequest model);
        void Add(NewsletterSubscriptionAddRequest model);
    }
}
