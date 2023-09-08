using Sabio.Models.Domain.Locations;
using Sabio.Models.Domain.Partners;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Stands
{
    public class StandDetails
    {
        public int Id { get; set; }
        public LookUp StandStatus { get; set; }
        public LookUp StandType { get; set; }
        public Partner Partner { get; set; }
        public bool IsPrivate { get; set; }
        public bool IsReservable { get; set; }
        public Location Location { get; set; }
        public DateTime DateOpened { get; set; }
        public BaseUser CreatedBy { get; set; }
        public BaseUser ModifiedBy { get; set; }
    }
}
