using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.SurveyAnswers
{
    public class SurveyAnswerUpdateRequest : SurveyAnswerAddRequest, IModelIdentifier
    {

        [Required(ErrorMessage = "Id field is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Id field must be a positive integer.")]
        public int Id { get; set; }
    }
}
