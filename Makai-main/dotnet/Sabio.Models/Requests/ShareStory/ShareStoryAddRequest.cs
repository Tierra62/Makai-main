using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Sabio.Models.Requests
{
    public class ShareStoryAddRequest
    {       
        [Required(ErrorMessage = "Name is required.")]
        [StringLength(50, MinimumLength = 2)] 
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Must be a valid email")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Does not meet length requirement.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Story is required.")]
        [StringLength(3000, MinimumLength = 10, ErrorMessage = "Does not meet length requirement.")]
        public string Story { get; set; }

        [Required(ErrorMessage = "Approval status is required.")]
        public bool IsApproved { get; set; }

        #nullable enable
        [Range(1, Int32.MaxValue)]
        public int? FileId { get; set; }
        #nullable disable
    }
}
