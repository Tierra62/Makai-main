using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.SurveyAnswers
{
    public class SurveyAnswerAddRequest
    {
        [Required(ErrorMessage = "InstanceId field is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "InstanceId field must be a non-negative integer.")]
        public int InstanceId { get; set; }

        [Required(ErrorMessage = "QuestionId field is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "QuestionId field must be a non-negative integer.")]
        public int QuestionId { get; set; }

        [Required(ErrorMessage = "AnswerOptionId field is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "AnswerOptionId field must be a non-negative integer.")]
        public int AnswerOptionId { get; set; }

        [Required(ErrorMessage = "Answer field is required.")]
        [StringLength(500, MinimumLength = 2, ErrorMessage = "Answer field must be more than 1 character.")]
        public string Answer { get; set; }

        [Required(ErrorMessage = "AnswerNumber field is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "AnswerNumber field must be a non-negative integer.")]
        public int AnswerNumber { get; set; }
    }
}
