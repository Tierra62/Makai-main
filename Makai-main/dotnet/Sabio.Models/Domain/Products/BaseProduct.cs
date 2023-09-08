using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Products
{
    public class BaseProduct
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ProductType { get; set; }
        public string Description { get; set; }
        public int StandId { get; set; }
        public int Identifier { get; set; }
        public int HourlyPriceInCents { get; set; }        
    }
}
