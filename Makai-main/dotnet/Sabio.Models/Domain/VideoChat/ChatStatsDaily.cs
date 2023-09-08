using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.VideoChat
{
    public class ChatStatsDaily
    {
        public DateTime Date { get; set; }
        public int TotalMeetings { get; set; }
        public int TotalDuration { get; set; }
        public int TotalParticipants { get; set; }
    }
}
