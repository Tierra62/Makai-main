using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.SurveyQuestions
{
    public class SurveyQuestionAnswerUpdateRequest : SurveyQuestionAnswerAddRequest, IModelIdentifier
    {
        [Required(ErrorMessage = "Id is required.")]
        public int Id {  get; set; }
    }
}
