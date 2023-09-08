using Sabio.Models.Requests.Partners;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Surveys
{
    public class SurveyUpdateRequest : SurveyAddRequest, IModelIdentifier
    {
        [Required]
        public int Id { get; set; }
    }
}
