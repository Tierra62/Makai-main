using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.LoyaltyPoints
{
    public class LoyaltyPointsTotal
    {
        public BaseUser User { get; set; }
        public int TotalLifeTimePoints { get; set; }
        public int TotalPointsRedeemed { get; set; }
        public int TotalPointsAvailable { get; set; }
    }
}
