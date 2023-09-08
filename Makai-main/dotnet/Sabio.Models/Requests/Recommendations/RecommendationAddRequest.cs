using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Recommendations
{
    public class RecommendationAddRequest 
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int PartnerId { get; set; }
        [Required]
        [Range(1, Int32.MaxValue)]
        public int SourceProductId { get; set; }
     
        [Required]
        [Range(1, Int32.MaxValue)]
        public int TargetProductId { get; set; }

        [Required]
        [StringLength(400, MinimumLength = 2)]
        public string Reason { get; set; }

    }
}
