using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.SurveyQuestions
{
    public class SurveyQuestionAddRequest
    {      
        [Required(ErrorMessage = "Question is required.")]
        [StringLength(500, MinimumLength = 2, ErrorMessage = "Does not meet Question length requirement.")]
        public string Question { get; set; }

#nullable enable
        public string? HelpText { get; set; }
#nullable disable

        [Required(ErrorMessage = "Required status is required.")]
        public bool IsRequired { get; set; }

        [Required(ErrorMessage = "Mutiple input allowed status is required")]
        public bool IsMultipleAllowed { get; set; }

        [Required(ErrorMessage = "QuestionTypeId is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Does not meet QuestionTypeId Requirement.")]
        public int QuestionTypeId { get; set; }

        [Required(ErrorMessage = "SurveyId is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Does not meet SurveyId Requirement.")]
        public int SurveyId { get; set; }

        [Required(ErrorMessage = "StatusId is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Does not meet StatusId Requirement.")]
        public int StatusId { get; set; }

        [Required(ErrorMessage = "SortOrder is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Must be greater than 0.")]
        public int SortOrder { get; set; }
    }
}
