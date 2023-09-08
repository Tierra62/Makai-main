using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Orders
{
    public class OrderItemV2: OrderItem
    {
        public int OrderId { get; set; }
        public int InsurancePriceInCents { get; set; }
        public int TotalPriceInCents { get; set; }
        public decimal TotalPriceWithTax { get; set; }
        public LookUp OrderStatus { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
