using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Carts
{
    public class CartAddRequest
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int ProductId { get; set; }
        [Required]
        [Range(1, Int32.MaxValue)]
        public int Quantity { get; set; }

    }
}
