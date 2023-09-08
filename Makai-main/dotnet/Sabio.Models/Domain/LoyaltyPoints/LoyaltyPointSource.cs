using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.LoyaltyPoints
{
    public class LoyaltyPointSource
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int PointsAwarded { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsExpired { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public BaseUser ModifiedBy { get; set; }
        public BaseUser CreatedBy { get; set; }

        public DateTime? DateExpire { get; set; }

    }
}
