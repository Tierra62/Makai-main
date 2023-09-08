using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Messages
{
    public class MessageAddRequest
    {
        [Required]
        [StringLength(1000)]
        public string Message { get; set; }

        [StringLength(100)]
        public string Subject { get; set; }

        [Required]
        [Range(1, Int32.MaxValue)]
        public int RecipientId { get; set; }

        public DateTime DateSent { get; set; }

        public DateTime DateRead { get; set; }
    }
}
