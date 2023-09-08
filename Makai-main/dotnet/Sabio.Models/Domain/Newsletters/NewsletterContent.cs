using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Newsletters
{
    public class NewsletterContent
    {
        public int NewsletterContentId { get; set; }
        public int TemplateKeyId { get; set; }
        public string KeyTypeName { get; set; }
        public string TemplateName { get; set; }
        public string TemplateDescription { get; set; }
        public int NewsletterId { get; set; }
        public string NewsletterCoverPhoto { get; set; }
        public string NewsletterName { get; set; }
        public string KeyName { get; set; }
        public LookUp KeyType { get; set; }
        public string Value { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public BaseUser User { get; set; }

    }
}
