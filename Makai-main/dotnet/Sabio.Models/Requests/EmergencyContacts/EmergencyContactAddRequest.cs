using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Sabio.Models.Requests.EmergencyContacts
{
    public class EmergencyContactAddRequest
    {
        

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [Phone]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$")]
        [MinLength(12), MaxLength(12)]
        public string PhoneNumber { get; set; }

    }
}
