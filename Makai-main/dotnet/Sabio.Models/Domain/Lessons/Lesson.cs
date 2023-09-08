using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Lessons
{
    public class Lesson
    {
        public int Id { get; set; }
        public int SiteTrainingId { get; set; }
        public string Title { get; set; }
        public string Subject { get; set; }
        public string Summary { get; set; }
        public string Duration { get; set; }
        public string CoverImageUrl { get; set; }
        public int LessonTypeId { get; set; }
        public BaseUser CreatedBy { get; set; }
        public BaseUser ModifiedBy { get; set;}
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public string MediaUrl { get; set; }



    }
}
