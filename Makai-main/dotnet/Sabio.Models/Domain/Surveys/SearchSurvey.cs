using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Surveys
{
    public class SearchSurvey
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Question { get; set; }
        public LookUp StatusId { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
