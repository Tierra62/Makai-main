using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Orders
{
    public class OrderPaymentHistory
    {
        public int Id { get; set; }
        public int? InsurancePriceInCents { get; set; }
        public int TotalPriceInCents { get; set; }
        public decimal? TotalPriceWithTax { get; set; }
        public string PaymentStatus { get; set; }
        public string TransactionType { get; set; }
        public DateTime TransactionDateModified { get; set; }
    }
}
