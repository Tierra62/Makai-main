using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain
{
    public class UserToken
    {
        public string Token { get; set; }
        public int UserId { get; set; }
        public LookUp TokenType { get; set; }
    }
}
