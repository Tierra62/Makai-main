using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Donations
{
    public class DSummary
    {
        public int CharitableFundId { get; set; }
        public string CharitableFundName { get; set;}
        public int TotalDonations { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
