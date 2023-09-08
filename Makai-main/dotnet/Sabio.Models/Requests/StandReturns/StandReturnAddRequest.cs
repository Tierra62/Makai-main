using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.StandReturns
{
    public class StandReturnAddRequest
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int StandId { get; set; }
      
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string ImageName { get; set; }

        [Required]
        [StringLength(255, MinimumLength = 1)]
        public string ImageUrl { get; set; }

        [Required]
        [Range(1, Int32.MaxValue)]
        public int ImageTypeId { get; set; }
        
        [Required]
        public bool IsDamaged { get; set; }
     

    }
}
