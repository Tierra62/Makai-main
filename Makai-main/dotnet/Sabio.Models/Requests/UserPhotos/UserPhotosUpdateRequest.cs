using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.UserPhotos
{
    public class UserPhotosUpdateRequest:  IModelIdentifier
    {
        public int Id { get; set; }
        public int? StandId { get; set; }
        public int? PartnerId { get; set; }
        [Required]
        [Url]
        public string ImageUrl { get; set; }
        [Required]
        [Range(0, 1)]
        public bool IsApproved { get; set; }
    
}
}
