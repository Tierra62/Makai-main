using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Podcasts
{
    public class PodcastAddRequest
    {
        [Required]
        [StringLength(50, MinimumLength = 2)] 
        public string Title { get; set; }
        [Required]
        [StringLength(200, MinimumLength = 2)] 
        public string Description { get; set; }
        [Required]
        [StringLength(200, MinimumLength = 2)] 
        public string Url { get; set; }
        [Required]
        [Range(1, Int32.MaxValue)] 
        public int PodcastTypeId { get; set; }
        [Required]
        [StringLength(200, MinimumLength = 2)] 
        public string CoverImageUrl { get; set;}
     
    }
}
