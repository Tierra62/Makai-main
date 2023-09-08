using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Users
{
    public class UserUpdateRequest : IModelIdentifier
    {
        public int Id { get; set; }
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
        [MinLength(1)]
        public string Mi { get; set; }

        [MaxLength(255)]
        public string AvatarUrl { get; set; }
        [Required]
        public DateTime DOB { get; set; }
    }
}
