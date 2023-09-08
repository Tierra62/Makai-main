using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.EmergencyContacts
{
    public class EmergencyContact
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Name { get; set; }

        public string PhoneNumber { get; set; }


    }
}
