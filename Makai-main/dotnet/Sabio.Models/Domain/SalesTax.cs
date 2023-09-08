using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class SalesTax
    {
        public int Id { get; set; }
        public int PostalCode { get; set; }
        public int StateId { get; set; }
        public decimal StateRate { get; set; }
        public decimal CombinedRate { get; set; }
        public decimal CountyRate { get; set; }
        public decimal CityRate { get; set; }
        public decimal SpecialRate { get; set; }
    }
}
