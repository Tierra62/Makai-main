using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Partners
{
    public class Stand
    {
        //This is just a placeholder since the  original guy working on stand
        //is no longer working on this. I made a temporary as told by someone
        //in queue to get my code up, running, tested, and PR'ed.
        public int Id { get; set; }
        public int StandStatusId { get; set; }
        public int StandTypeId { get; set; }
        public int PartnerId { get; set; }
        public bool IsPrivate { get; set; }
        public bool IsReservable { get; set; }
        public int LocationId { get; set; }
        public DateTime DateOpened { get; set; }
    }
}
