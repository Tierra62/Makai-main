using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Partners
{
    public class Member
    {
        public BaseUser User { get; set; }
        public LookUp PartnerType { get; set; }
    }
}
