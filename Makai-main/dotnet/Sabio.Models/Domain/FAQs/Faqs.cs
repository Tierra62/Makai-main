using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.FAQs
{
    public class Faqs
    {
        public int Id { get; set; }

        public string Question { get; set; }

        public string Answer { get; set; }

        public int SortOrder { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.Now;

        public DateTime DateModified { get; set; } = DateTime.Now;

        public int CreatedBy { get; set; }

        public int ModifiedBy { get; set;}

        public LookUp FaqCategories { get; set; }
    }
}
