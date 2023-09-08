using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Files
{
    public class AWSFileAddRequest
    {
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Url { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int Id { get; set; }
    }
}
