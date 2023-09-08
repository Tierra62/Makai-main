using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.UserPhotos
{
    public class UserPhotos

    {
        public int Id { get; set; }
        public BaseUser User { get; set; }
        public int StandId { get; set; }
        public int PartnerId { get; set; }
        public string ImageUrl { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public bool IsApproved { get; set; }
        public int ApprovedBy { get; set; }
        public string Name { get; set; }

    }
}
