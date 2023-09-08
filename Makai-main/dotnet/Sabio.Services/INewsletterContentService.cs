using Sabio.Models.Domain.Newsletters;
using Sabio.Models.Requests.Newsletter;
using System.Collections.Generic;

namespace Sabio.Services
{
    public interface INewsletterContentService
    {
        int Add(NewsletterContentAddRequest model, int userId);
        void Update(NewsletterContentUpdateRequest model, int userId);
        public void DeleteById(int id);
        public List<NewsletterContent> GetByNewsletterId(int id);
    }
}