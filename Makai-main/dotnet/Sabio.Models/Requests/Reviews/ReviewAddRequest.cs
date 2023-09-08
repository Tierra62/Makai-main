using Sabio.Models.Requests.Partners;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Reviews
{
    public class ReviewAddRequest
    {
        [Required]
        [StringLength(50)]
        public string Subject { get; set; }

        [Required]
        [StringLength(3000)]
        public string Text { get; set; }

        [Required]
        [Range(0, Int32.MaxValue)]
        public int EntityId { get; set; }
    }
}
