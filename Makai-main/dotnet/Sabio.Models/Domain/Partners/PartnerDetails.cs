using Sabio.Models.Domain.Stands;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Partners
{
    public class PartnerDetails : Partner
    {
        public List<Stand> Stands { get; set; }
        public List<Member> Members { get; set; }
    }
}
