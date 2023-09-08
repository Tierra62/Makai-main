using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Stripe
{
    public class StripeKeys
    {
        public string PublishableKey { get; set; }
        public string SecretKey { get; set; }
    }
}
