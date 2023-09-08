using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Stripe
{
    public class AddSessionDetailsRequest
    {
        [Required]
        [MinLength(10), MaxLength(200)]
        public string SessionId { get; set; }
    }
}
