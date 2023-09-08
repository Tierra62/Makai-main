using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Partners
{
    public class Partner : LookUp
    {
        public string Logo { get; set; }
        public string BusinessPhone { get; set; }
        public string SiteUrl { get; set; }
        public BaseUser User { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public bool IsActive { get; set; }
    }
}
