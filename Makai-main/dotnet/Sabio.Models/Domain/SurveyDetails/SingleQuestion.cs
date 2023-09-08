using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.SurveyDetails
{
    public class SingleQuestion
    {
        public int Id { get; set; }
        public int Type { get; set; }
        public string Question { get; set; }
        public int StatusId { get; set; }
        public List<Answer> AnswerOptions { get; set; }
    }
}
