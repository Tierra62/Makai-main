using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Stripe
{
    public class StripeUserAddRequest
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int UserId { get; set; }
        [Required]
        [MinLength(2), MaxLength(100)]
        public string StripeAccountId { get; set; }
        [Required]
        [MinLength(2), MaxLength(100)]
        public string Name { get; set; }
    }
}
