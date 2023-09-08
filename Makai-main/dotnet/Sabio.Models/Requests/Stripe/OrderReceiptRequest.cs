using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Stripe
{
    public class OrderReceiptRequest
    {
        [Required]
        [MinLength(2), MaxLength(200)]
        public string StripeSessionId { get; set; }
        [MinLength(2), MaxLength(200)]
        public string Recipient { get; set; }
        [Required]
        [Range(1, Int32.MaxValue)]
        public int AmountTotal { get; set; }
        [Required]
        [MinLength(2), MaxLength(50)]
        public string PaymentStatus { get; set; }
        [Required]
        [MinLength(2), MaxLength(50)]
        public string TransactionType { get; set; }

    }
}
