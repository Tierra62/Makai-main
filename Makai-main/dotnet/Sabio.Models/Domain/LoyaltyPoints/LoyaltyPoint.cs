using Sabio.Models.Requests.LoyaltyPoints;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.LoyaltyPoints
{
    public class LoyaltyPoint
    {
        public int Id { get; set; }
        public BaseUser User { get; set; }
        public LoyaltyPointSource LoyaltyPointSource { get; set; }
        public DateTime DateCreated { get; set; }
        
    }
}
