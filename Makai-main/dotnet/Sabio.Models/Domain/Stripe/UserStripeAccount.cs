using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Stripe
{
    public class UserStripeAccount
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string StripeAccountId { get; set; }
        public string Name { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
