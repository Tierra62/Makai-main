using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.VideoChat
{
    public class Room
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public bool api_created { get; set; }
        public string Privacy { get; set; }
        public string Url { get; set; }
        public DateTime Created_At { get; set; }
        public RoomConfig Config { get; set; }
    }
}
