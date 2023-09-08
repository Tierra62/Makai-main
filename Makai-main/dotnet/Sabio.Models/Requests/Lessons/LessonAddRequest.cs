using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Sabio.Models.Requests.Lessons
{
    public class LessonAddRequest
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int SiteTrainingId { get; set; }
        [Required]
        [StringLength(50)]
        public string Title { get; set; }
        [Required]
        [StringLength(50)]
        public string Subject { get; set; }
        [Required]
        [StringLength(200)]
        public string Summary { get; set; }
        [Required]
        [StringLength(50)]
        public string Duration { get; set; }
        [Required]
        [StringLength(250)]
        public string CoverImageUrl { get; set; }
        [Required]
        [Range(1, Int32.MaxValue)]
        public int LessonTypeId { get; set; }
        [Required]
        [StringLength(250)]
        public string MediaUrl { get; set; }

    }


}
