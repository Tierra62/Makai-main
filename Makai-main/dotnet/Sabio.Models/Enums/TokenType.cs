using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Enums
{
    public enum TokenType : int
    {
        NotSet = 0,
        NewUser,
        ResetPassword,
        PasswordChanged
    }
}
