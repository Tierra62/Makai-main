using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.SurveyDetails
{
    public class SurveyDetail
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<SingleQuestion> Questions { get; set; }
    }
}
