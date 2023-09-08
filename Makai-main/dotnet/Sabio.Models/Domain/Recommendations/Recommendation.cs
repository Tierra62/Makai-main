using Sabio.Models.Domain.Partners;
using Sabio.Models.Domain.Products;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Recommendations
{
    public class Recommendation
    {
        public int Id { get; set; }
        public LookUp PartnerId { get; set; }
        public BaseProduct SourceProductId { get; set; }

        public BaseProduct TargetProductId { get; set; }

        public string Reason { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
