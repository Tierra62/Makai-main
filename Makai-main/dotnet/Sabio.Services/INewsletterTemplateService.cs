using Sabio.Models;
using Sabio.Models.Domain.Newsletters;
using Sabio.Models.Requests.Newsletter;

namespace Sabio.Services
{
    public interface INewsletterTemplateService
    {
        int AddNewsletterTemplate(NewsletterTemplateAddRequest model, int userId);
        void DeleteById(int id);
        Paged<NewsletterTemplate> GetAll(int pageIndex, int pageSize);
        void UpdateNewsletterTemplate(NewsletterTemplateUpdateRequest model, int userId);
    }
}