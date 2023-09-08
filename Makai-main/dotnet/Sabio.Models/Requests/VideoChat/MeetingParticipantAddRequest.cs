using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.VideoChat
{
    public class MeetingParticipantAddRequest
    {
        [Required(ErrorMessage = "The DailyMeetingId field is required.")]
        public int? DailyMeetingId { get; set; }

        [Required(ErrorMessage = "The UserId field is required.")]
        public int? UserId { get; set; }

        [Required(ErrorMessage = "The Duration field is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "The Duration field must be greater than 0.")]
        public int Duration { get; set; }

        [Required(ErrorMessage = "the timejoined field is required.")]
        public string TimeJoined { get; set; }
    }
}
