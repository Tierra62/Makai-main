﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.EmergencyContacts
{
    public class EmergencyContactUpdateRequest : EmergencyContactAddRequest , IModelIdentifier
    {
        [Required]
        public int Id { get; set; }
    }
}
