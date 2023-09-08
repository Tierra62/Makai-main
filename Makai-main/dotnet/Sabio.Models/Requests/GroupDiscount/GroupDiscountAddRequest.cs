using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.GroupDiscount
{
    public class GroupDiscountAddRequest

    {

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        [StringLength(400)]
        public string Description { get; set; }

        [Required]
        [Range(1, Int32.MaxValue)]
        public int DiscountTypeId { get; set; }

        [Required]
        [Range(1, Int32.MaxValue)]
        public int Value { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

      

    }
}
