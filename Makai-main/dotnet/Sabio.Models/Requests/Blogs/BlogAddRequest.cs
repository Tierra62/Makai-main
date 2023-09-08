using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Blogs
{
    public class BlogAddRequest
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int BlogCategoryId { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Title { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string Subject { get; set; }
        [StringLength(4000, MinimumLength = 2)]
        public string Content { get; set; }
        [Required]
        public bool IsPublished { get; set; }
        public Nullable<DateTime> DatePublish { get; set; }
        [StringLength(255, MinimumLength = 2)]
        public string ImageUrl { get; set; }
    }
}
