using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.VideoChat
{
    public class RoomAddRequest
    {
        [Required(ErrorMessage = "The Name field is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "The Privacy field is required.")]
        [Range(1, 3, ErrorMessage = "The Privacy field must be between 1 and 3.")]
        public int Privacy { get; set; }

        [Required(ErrorMessage = "The Properties field is required.")]
        public RoomPropertiesRequest Properties { get; set; }
    }
}
