using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Orders
{
    public class OrderUpdateRequest : IModelIdentifier
    {
        public int Id { get; set; }
        [Required]
        [Range(0, Int32.MaxValue)]
        public int TotalPriceInCents { get; set; }
        [Required]
        [Range(0, Int32.MaxValue)]
        public decimal TotalPriceWithTax { get; set; }
        [Required]
        [StringLength(200, MinimumLength = 2)]
        public string StripeSessionId { get; set; }
        [Required]
        [Range(1,5)]
        public int OrderStatusId { get; set; }
    }
}
