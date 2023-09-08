using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Partners
{
    public class PartnerAddRequest
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(255)]
        public string Logo { get; set; }

        [Required]
        [StringLength(50)]
        public string BusinessPhone { get; set; }

        [Required]
        [StringLength(255)]
        public string SiteUrl { get; set; }

        [Required]
        public bool IsActive { get; set; }
    }
}
