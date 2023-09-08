using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Comments
{
    public class CommentsAddRequest
    {
        [StringLength(100, MinimumLength = 2)]
#nullable enable
        public string? Subject { get; set; }

        [Range(1, Int32.MaxValue)]
        public int? ParentId { get; set; }
#nullable disable
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Text { get; set; }
        [Required]
        [Range(1, Int32.MaxValue)]
        public int EntityTypeId { get; set; }
        [Required]
        [Range(1, Int32.MaxValue)]
        public int EntityId { get; set; }
    }
}
