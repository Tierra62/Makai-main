using Sabio.Models.Domain.Products;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Orders
{
    public class OrderItem
    {
        public int Id { get; set; }
        public BaseProduct Product { get; set; }
        public int PriceInCents { get; set; }
        public decimal PriceWithTax { get; set; }
        public DateTime EstimatedStartTime { get; set; }
        public DateTime EstimatedStopTime { get; set; }
        public DateTime ActualStartTime { get; set; }
        public DateTime ActualStopTime { get; set; }
    }
}
