using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class User : BaseUser
    {
        public string Email { get; set; }

        public string Phone { get; set; }

        public DateTime DOB { get; set; }

        public List<LookUp> Roles { get; set; }

        public LookUp StatusType { get; set; }

        public bool Is2FA { get; set; }

    }
}
