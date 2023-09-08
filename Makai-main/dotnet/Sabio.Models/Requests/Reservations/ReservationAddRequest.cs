using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Reservations
{
    public class ReservationAddRequest
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int ProductId { get; set; }
        [Required]
        public DateTime DateCheckIn { get; set; }
        [Required]
        [Range(30, 300)]
        public int RentalTime { get; set; }
        [Required]
        public string ChargeId { get; set; }
        [Required]
        [Range(1, 5)]
        public int StatusId { get; set; }
    }
}
