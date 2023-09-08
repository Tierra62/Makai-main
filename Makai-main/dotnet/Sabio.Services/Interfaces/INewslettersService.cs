using Sabio.Models;
using Sabio.Models.Domain.Newsletters;
using Sabio.Models.Requests.Newsletter;

namespace Sabio.Services.Interfaces
{
    public interface INewslettersService
    {
        Paged<Newsletter> GetAll(int pageIndex, int pageSize);
        public int AddNewsletter(NewsletterAddRequest model, int userId);
        public void DeleteById(int id);
        public void UpdateNewsletter(NewsletterUpdateRequest model, int userId);
    }
}