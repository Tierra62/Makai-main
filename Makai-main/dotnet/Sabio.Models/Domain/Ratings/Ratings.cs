using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Ratings
{
	public class Ratings
	{
		public int Id { get; set; }
		public byte Rating { get; set; }
		public LookUp EntityType { get; set; }
        public int EntityId { get; set; }
		public DateTime DateCreated { get; set; }
		public int ModifiedBy { get; set; }
		public DateTime DateModified { get; set; }
		public bool IsDeleted { get; set; }
        public int CommentId { get; set; }
        public int CreatedBy { get; set; }
        public BaseUser User { get; set; }

    }
}
