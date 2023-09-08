using Google.Apis.Util;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Users
{
    public class UserLoginRequest
    {
        [MaxLength(255)]
        [Required(ErrorMessage = "Email Address is required")]
        public string Email { get; set; }

        [MaxLength(100)]
        [DataType(DataType.Password)]
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}
