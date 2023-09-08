using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.LoginLog
{
    public class LoginLog
    {
        public int Id { get; set; }
        public BaseUser User { get; set; }
        public string Email { get; set; }
        public string IPAddress { get; set; }
        public DateTime DateLoggedIn { get; set; }
    }
}
