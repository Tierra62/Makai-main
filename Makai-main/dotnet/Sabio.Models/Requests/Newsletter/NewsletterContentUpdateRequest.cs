using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Newsletter
{
    public class NewsletterContentUpdateRequest:  IModelIdentifier
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int Id { get; set; }
        [Required]
        [StringLength(4000, MinimumLength = 2, ErrorMessage = "Max Length is 4000")]
        public string Value { get; set; }

    }
}
