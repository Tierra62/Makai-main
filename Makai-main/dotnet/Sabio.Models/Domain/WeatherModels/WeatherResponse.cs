using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.WeatherModels
{
    public class WeatherResponse
    {
        public Location location { get; set; }
        public Current current { get; set; }
    }

    
    
 
}
