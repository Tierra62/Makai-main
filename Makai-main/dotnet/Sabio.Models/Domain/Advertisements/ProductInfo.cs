using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Sabio.Models.Domain.Advertisements
{
    public class ProductInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ProductTypeId { get; set; }
        public string Description { get; set; }
        public string Position { get; set; }
        public int StatusType { get; set; }
        public int HourlyPriceInCents { get; set; }
    }
}