using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.VideoChat
{
    public class RoomConfig
    {
        public bool StartAudioOff { get; set; }
        public bool StartVideoOff { get; set; }
        public bool EnableChat { get; set; }
        public ulong Exp { get; set; }
    }
}

