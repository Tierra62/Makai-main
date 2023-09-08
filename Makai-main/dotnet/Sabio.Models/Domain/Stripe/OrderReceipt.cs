using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Stripe
{
    public class OrderReceipt
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string StripeSessionId { get; set; }
        public string Recipient { get; set; }
        public int AmountTotal { get; set; }
        public string PaymentStatus { get; set; }
        public string TransactionType { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
