using Sabio.Models.Domain.ExternalLinks;
using Sabio.Models.Requests.ExternalLinks;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IExternalLinkService
    {
        List<ExternalLink> GetByCreatorId(int creatorId);
        int Add(ExternalLinkAddRequest model, int userId);
        void Update(ExternalLinkUpdateRequest model, int userId);
        void Delete(int id);
        ExternalLink GetById(int id);
    }
}