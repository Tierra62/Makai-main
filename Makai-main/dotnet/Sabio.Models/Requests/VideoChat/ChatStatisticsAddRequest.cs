using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.VideoChat
{
    public class ChatStatisticsAddRequest
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int HostId { get; set; }
        
        [Required]
        [StringLength(255, MinimumLength = 2)]
        public string DailyId { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string RoomName { get; set; }

        [Required]
        [Range(1, Int32.MaxValue)]
        public int Duration { get; set; }

        [Required]
        public DateTime StartTime { get; set; }
    }
}
