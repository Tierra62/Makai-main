using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.SiteReferences
{
    public class SiteReferenceAddRequest
    {
        public int SiteReferenceId { get; set; }   
        public int UserId { get; set; }  
    }
}
