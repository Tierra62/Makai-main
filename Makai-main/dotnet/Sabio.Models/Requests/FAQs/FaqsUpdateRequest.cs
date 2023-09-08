using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.FAQs
{
    public class FaqsUpdateRequest  : FaqsAddRequest, IModelIdentifier
    {
        public int Id { get; set; }

    }
}
