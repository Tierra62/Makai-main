using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Domain.VideoChat;

namespace Sabio.Models.Requests.VideoChat
{
    public class TokenAddRequest
    {
        [Required(ErrorMessage = "The Properties field is required.")]
        public TokenProperties Properties { get; set; }
    }
}
