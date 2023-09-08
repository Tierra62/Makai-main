using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Stripe
{
    public class AccountAddRequest
    {
        [EmailAddress]
        [Required]
        [MinLength(7), MaxLength(150)]
        public string Email { get; set; }
    }
}
