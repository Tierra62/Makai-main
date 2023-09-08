using System;
using Sabio.Models.Domain.Stands;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Domain.Partners;

namespace Sabio.Models.Domain.StandReturns
{
    public class StandReturnDetails
    {
        public int Id { get; set; }
        public StandDetails Stand { get; set; }
        public  BaseUser User { get; set; }
        public File Image { get; set; }
        public bool IsDamaged { get; set; }
        public DateTime DateCreated { get; set; }


    }
}
