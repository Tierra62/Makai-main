using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Stripe
{
    public class AccountLinkAddRequest
    {
        [Required]
        [MinLength(7), MaxLength(150)]
        public string AccountId { get; set; }
    }
}
