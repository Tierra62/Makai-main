using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.InsuranceOptions
{
    public class InsuranceOptionAddRequest
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int OrderId { get; set; }

        [Required]
        [Range(0, Int32.MaxValue)]
        public int Cost { get; set; }
    }
}
