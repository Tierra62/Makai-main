using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Users
{
    public class ChangePasswordV2: UserEmailUpdateRequest
    {
        [RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", ErrorMessage = "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character.")]
        [MaxLength(100)]
        [MinLength(8)]
        [DataType(DataType.Password)]
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }

        [MaxLength(100)]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Password fields do not match, please try again.")]
        [Required]
        public string ConfirmPassword { get; set; }
    }
}
