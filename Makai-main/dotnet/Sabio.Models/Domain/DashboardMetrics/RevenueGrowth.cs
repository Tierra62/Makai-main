using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Metrics
{
    public class RevenueGrowth
    {
        public int RevenueLastWeek { get; set; }
        public int RevenueLastMonth { get; set; }
        public int RevenueLastYear { get; set; }
        public Decimal RevenueGrowthLastWeek { get; set; }
        public Decimal RevenueGrowthLastMonth { get; set; }
        public Decimal RevenueGrowthLastYear { get; set; }
        public Decimal RevenueGrowthLastWeekOnYear { get; set; }
        public Decimal RevenueGrowthLastMonthOnYear { get; set; }
    }
}
