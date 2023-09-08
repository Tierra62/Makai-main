using Sabio.Models.Domain.FAQs;
using Sabio.Models.Requests.FAQs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IFaqsService
    {
        int Add(FaqsAddRequest model, int userId);

        void Update(FaqsUpdateRequest model, int userId);
        Faqs Get(int id);

        List<Faqs> GetAllFaqs();

        void Delete(int id);

    }
}
