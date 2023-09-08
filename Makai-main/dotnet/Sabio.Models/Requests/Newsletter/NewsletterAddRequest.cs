using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Newsletter
{
    public class NewsletterAddRequest
    {
        [Required]
        [Range (1, Int32.MaxValue)]
        public int TemplateId { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; }
        [StringLength(255, MinimumLength = 2)]
        public string CoverPhoto { get; set; }
        public DateTime? DateToPublish { get; set; }
        public DateTime? DateToExpire { get; set; }
        public List <NewsletterContentAddRequest> ContentList { get; set; }

    }
}
