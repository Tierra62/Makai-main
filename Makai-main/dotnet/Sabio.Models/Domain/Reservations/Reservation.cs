using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Reservations
{
    public class Reservation
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public DateTime DateCheckIn { get; set; }
        public int RentalTime { get; set; }
        public string ChargeId { get; set; }
        public int StatusId { get; set; }
        public string Name { get; set; }
        public BaseUser User { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
