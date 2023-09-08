using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Stripe
{
    public class TransferPaymentRequest
    {
        [Required]
        [MinLength(7), MaxLength(150)]
        public string AccountId { get; set; }
        [Required]
        public long Amount { get; set; }
    }
}
