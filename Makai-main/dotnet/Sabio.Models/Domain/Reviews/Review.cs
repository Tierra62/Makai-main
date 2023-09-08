using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Reviews
{
    public class Review
    {
        public int Id { get; set; }
        public string Subject { get; set; }
        public string Text { get; set; }
        public int EntityId { get; set; }
        public BaseUser User { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public bool IsDeleted { get; set; }
    }
}
