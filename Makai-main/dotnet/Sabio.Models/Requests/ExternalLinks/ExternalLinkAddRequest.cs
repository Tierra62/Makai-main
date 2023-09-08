using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.ExternalLinks
{
    public class ExternalLinkAddRequest
    {
        [Required]
        [Range(1, 5)]
        public int UrlTypeId { get; set; }
        [Required]
        [StringLength(255, ErrorMessage = "Url must be between 2 and 255 characters", MinimumLength = 2)]
        public string Url { get; set; }
        [Required]
        [Range(1, Int32.MaxValue)]
        public int EntityId { get; set; }
        [Required]
        [Range(1, 5)]
        public int EntityTypeId { get; set; }
    }
}
