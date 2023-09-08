using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.GroupDiscounts
{
    public class GroupDiscount
    { 
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int PartnerId { get; set; }
        public LookUp DiscountType { get; set; }
        public int Value { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }

    }


}
