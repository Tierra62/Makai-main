using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.SalesTaxes
{
    public class SalesTaxResponse
    {
        [JsonPropertyName("state")]
        public string state { get; set; }

        [JsonPropertyName("state_rate")]
        public decimal state_rate { get; set; }

        [JsonPropertyName("estimated_combined_rate")]
        public decimal estimated_combined_rate { get; set;}

        [JsonPropertyName("estimated_county_rate")]
        public decimal estimated_county_rate { get; set; }

        [JsonPropertyName("estimated_city_rate")]
        public decimal estimated_city_rate { get; set; }

        [JsonPropertyName("estimated_special_rate")]
        public decimal estimated_special_rate { get; set; }
       
    }
}
