using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.VideoChat
{
    public class RoomPropertiesRequest
    {
        public bool StartAudioOff { get; set; }
        public bool StartVideoOff { get; set; }
        public bool EnableChat { get; set; }

        [Range(0, 999999, ErrorMessage = "The Exp field must be between 0 and 999.")]
        public int Exp { get; set; }
    }
}
