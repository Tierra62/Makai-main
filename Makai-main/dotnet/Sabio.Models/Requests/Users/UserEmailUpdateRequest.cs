using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Users
{
    public class UserEmailUpdateRequest
    {
        [MaxLength(255)]
        [MinLength(2)]
        [EmailAddress]
        [Required]
        public string Email { get; set; }

        [MaxLength(100)]
        [Required(ErrorMessage = "Current Password is required")]
        public string CurrentPassword { get; set; }
    }
}
