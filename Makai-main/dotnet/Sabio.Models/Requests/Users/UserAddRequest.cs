using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Users
{
    public class UserAddRequest
    {
        [MaxLength(255)]
        [MinLength(2)]
        [EmailAddress]
        [Required]
        public string Email { get; set; }

        [MaxLength(50)]
        [Required]
        public string Phone { get; set; }

        [MaxLength(100)]
        [MinLength(2)]
        [Required]
        public string FirstName { get; set; }

        [MaxLength(100)]
        [MinLength(2)]
        [Required]
        public string LastName { get; set; }

        [MaxLength(2)]
        public string Mi { get; set; }

        [RegularExpression("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", ErrorMessage = "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character.")]
        [MaxLength(100)]
        [MinLength(8)]
        [DataType(DataType.Password)]
        [Required]  
        public string Password { get; set; }


        [MaxLength(100)]
        [DataType(DataType.Password)]
        [Compare("Password",ErrorMessage = "Password fields do not match, please try again.")]
        [Required]
        public string ConfirmPassword { get; set; }

        [Required]
        public DateTime DOB { get; set; }  

        [Range(1, int.MaxValue)]
        [Required]
        public int RoleId { get; set; }

        public string Message { get; set; }

    }
}
