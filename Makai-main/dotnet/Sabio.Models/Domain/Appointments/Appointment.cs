using System;

namespace Sabio.Models.Domain.Appointments
{
    public class Appointment
    {
        public int Id { get; set; }
#nullable enable
        public string? Phone { get; set; }
#nullable disable
        public DateTime StartDateTime { get; set; }
        public TimeSpan Time { get; set; }
        public bool IsConfirmed { get; set; }
        public bool IsCancelled { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public BaseUser ModifiedBy { get; set; }
        public BaseUser CreatedBy { get; set; }
    }
}