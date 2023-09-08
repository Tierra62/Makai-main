using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Stands
{
    public class StandAddRequest
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int StandStatusId { get; set; }

        [Required]
        [Range(1, Int32.MaxValue)]
        public int StandTypeId { get; set; }

        [Range(1, Int32.MaxValue)]
        public int PartnerId { get; set; }

        [Required]
        public bool IsPrivate { get; set; }

        [Required]
        public bool IsReservable { get; set; }

        [Range(1, Int32.MaxValue)]
        public int LocationId { get; set; }

        [Required]
        public DateTime DateOpened { get; set; }
    }
}
