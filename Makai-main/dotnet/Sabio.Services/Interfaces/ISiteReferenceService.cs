using Sabio.Models;
using Sabio.Models.Domain.SiteReferences;
using Sabio.Models.Requests.SiteReferences;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface ISiteReferenceService
    {
        int Add(SiteReferenceAddRequest model);
        Paged<SiteReference> GetPaginated(int pageIndex, int pageSize);
        public List<SiteReferenceChart> GetAllChart();
    }
}
