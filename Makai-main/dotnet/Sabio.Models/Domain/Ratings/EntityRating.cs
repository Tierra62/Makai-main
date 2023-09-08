using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Ratings
{
	public class EntityRating
	{
		public int AverageRating { get; set; }
		public int TotalNumber { get; set; }
	}
}

