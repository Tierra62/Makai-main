using Sabio.Models.Requests.Partners;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Reviews
{
    public class ReviewUpdateRequest : ReviewAddRequest, IModelIdentifier
    {
        [Required]
        public int Id { get; set; }
    }
}
