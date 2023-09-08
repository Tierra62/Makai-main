using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.SiteTrainings
{
    public class SiteTrainingsAddRequest
    {
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string Title { get; set; }
        [Required]
        [StringLength(500, MinimumLength = 2)]
        public string Description { get; set; }
        [Required]
        [StringLength(250, MinimumLength = 2)]
        public string CoverImageUrl { get; set; }
        [Required]
        [Range(1, Int32.MaxValue)]
        public int CategoryId { get; set; }
    }
}
