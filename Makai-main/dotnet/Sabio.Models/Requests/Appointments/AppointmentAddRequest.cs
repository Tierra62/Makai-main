using System;
using System.ComponentModel.DataAnnotations;

namespace Sabio.Models.Requests.Appointments
{
    public class AppointmentAddRequest
    {
        [StringLength(50, MinimumLength = 10)]
#nullable enable
        public string? Phone { get; set; }
#nullable disable
        [Required]
        public TimeSpan Time { get; set; }
        [Required]
        public DateTime StartDateTime { get; set; }
    }
}
