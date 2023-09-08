using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.UserPhotos
{
    public class UserPhotosUpdateIsApprovedRequest: IModelIdentifier
    {
        public int Id { get; set; }
        [Required]
        public bool IsApproved { get; set; }
    }
}
