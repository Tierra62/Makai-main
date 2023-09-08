using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.UserPhotos
{
    public class UserPhotosAddRequest
    {
        [Required]
        [Range (1,Int32.MaxValue)]
        public int ProductId { get; set; }
        [Required]
        [Url]
        public string ImageUrl { get; set; }

    }
}
