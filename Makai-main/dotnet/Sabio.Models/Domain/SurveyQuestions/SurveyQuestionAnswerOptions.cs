﻿using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Sabio.Models.Domain.SurveyQuestions
{
    public class SurveyQuestionAnswerOptions
    {        
        public int Id { get; set; }

        public int QuestionId { get; set; }

        public string Text { get; set; }

        public string Value { get; set; }

        public string AdditionalInfo { get; set; }

        public BaseUser CreatedBy { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }
    }
}
