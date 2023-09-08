using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.LoyaltyPoints
{
    public class LoyaltyPointSourceAddRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Name { get; set; }
        [Required]
        [Range(Int32.MinValue, Int32.MaxValue)]
        public int PointsAwarded { get; set; }

        public Nullable<DateTime> DateExpire { get; set; }
    }
}
