using Google.Apis.AnalyticsData.v1beta.Data;
using Google.Apis.AnalyticsReporting.v4.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dimension = Google.Apis.AnalyticsReporting.v4.Data.Dimension;
using Metric = Google.Apis.AnalyticsReporting.v4.Data.Metric;

namespace Sabio.Models.Requests.GoogleReportRequest
{
    public class GoogleGetReportRequest
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public List<Metric> Metrics { get; set; }
        public List<Dimension> Dimensions { get; set; }
    }
}