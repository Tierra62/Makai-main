using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.CharitableFunds
{
    public class CharitableFundAddRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; }

        #nullable enable
        [StringLength(1000)]
        public string? Description { get; set; }
        #nullable disable

        [Required]
        [StringLength(255, MinimumLength = 2)]
        public string Url { get; set; }
        
    }
}
