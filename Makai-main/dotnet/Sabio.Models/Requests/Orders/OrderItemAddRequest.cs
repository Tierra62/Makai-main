using Sabio.Models.Domain.Products;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Orders
{
    public class OrderItemAddRequest
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int ProductId { get; set; }
        [Required]
        [Range(0, Int32.MaxValue)]
        public int PriceInCents { get; set; }
        [Range(0, Int32.MaxValue)]
        public decimal PriceWithTax { get; set; }
        [Required]
        public DateTime EstimatedStartTime { get; set; }
        [Required]
        public DateTime EstimatedStopTime { get; set; }
    }
}
