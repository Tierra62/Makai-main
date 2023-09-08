using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Stripe
{
    public class SessionAddRequest
    {
        [Required]
        [MinLength(2), MaxLength(100)]
        public string ProductName { get; set; }
        [Required]
        [Range(1, 1000000)]
        public int Cost { get; set; }
        [Required]
        [Range(1, 1000)]
        public int Quantity { get; set; }

    }
}
