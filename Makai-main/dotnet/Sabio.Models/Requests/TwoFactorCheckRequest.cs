﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests
{
    public class TwoFactorCheckRequest : TwoFactorRequest
    {
        public string Code { get; set; }
    }
}
