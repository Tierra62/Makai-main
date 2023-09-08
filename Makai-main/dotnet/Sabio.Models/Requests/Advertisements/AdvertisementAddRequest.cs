using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Advertisements
{
    public class AdvertisementAddRequest
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int ProductId { get; set; }
        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Title does not meet length requirements")]
        public string Title { get; set; }
#nullable enable
        [StringLength(255, MinimumLength = 1, ErrorMessage = "AdMainImage does not meet length requirements")]
        public string? AdMainImage { get; set; }
        [StringLength(100, MinimumLength = 1, ErrorMessage = "Details does not meet length requirements")]
        public string? Details { get; set; }
#nullable disable
        [Required]
        public DateTime DateStart { get; set; }
        [Required]
        public DateTime DateEnd { get; set; }


    }
}
