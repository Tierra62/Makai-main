using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Stands
{
    public class StandGeoRequest
    {
        [Required]
        [Range(0, Int32.MaxValue)]
        public int PageIndex { get; set; }

        [Required]
        [Range(0, Int32.MaxValue)]
        public int PageSize { get; set; }

        [Required]
        [Range(-90, 90)]
        public double Latitude { get; set; }

        [Required]
        [Range(-180, 180)]
        public double Longitude { get; set; }

        [Required]
        [Range(0, Int32.MaxValue)]
        public int Distance { get; set; }
    }
}
