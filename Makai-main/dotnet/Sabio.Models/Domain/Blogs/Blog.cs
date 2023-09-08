﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Blogs
{
    public class Blog
    {
        public int Id { get; set; }
        public LookUp CategoryType { get; set; }
        public BaseUser Author { get; set; }
        public string Title { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public Boolean IsPublished { get; set; }
        public string ImageUrl { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public DateTime DatePublish { get; set; } 
        public bool isDeleted { get; set; }
    }
}
