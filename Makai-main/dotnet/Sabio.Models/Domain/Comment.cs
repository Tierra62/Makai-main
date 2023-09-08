using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class Comment 
    {
        public int Id { get; set; }
#nullable enable
        public string? Subject { get; set; }
        public int? ParentId { get; set; }
#nullable disable
        public string Text { get; set; }
        public LookUp EntityType { get; set; }
        public int EntityId { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public BaseUser Author { get; set; }
        public bool IsDeleted { get; set; }
        public List<Comment> Replies { get; set; }
    }
}
