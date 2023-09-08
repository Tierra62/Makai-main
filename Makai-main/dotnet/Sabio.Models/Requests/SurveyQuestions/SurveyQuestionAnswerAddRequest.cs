using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Sabio.Models.Requests.SurveyQuestions
{
    public class SurveyQuestionAnswerAddRequest
    {
        [Required(ErrorMessage = "QuestionId is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Does not meet QuestionId Requirement.")]
        public int QuestionId { get; set; }

        [Required(ErrorMessage = "Text is required.")]
        [StringLength(500, MinimumLength = 2, ErrorMessage = "Does not meet text length requirement.")]
        public string Text { get; set; }

#nullable enable
        public string? Value { get; set; }

        public string? AdditionalInfo { get; set; } 

    }
}
