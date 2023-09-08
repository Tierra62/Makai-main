using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.SiteReferences
{
    public class SiteReference
    {
        public LookUp Type { get; set; }

        public int UserId { get; set; }
    }
}
