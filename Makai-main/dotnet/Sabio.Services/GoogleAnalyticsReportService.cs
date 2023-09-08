using Google.Apis.AnalyticsReporting.v4;
using Google.Apis.AnalyticsReporting.v4.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Domain.GoogleAnalytics;
using Sabio.Models.Requests.GoogleReportRequest;
using System.IO;
using Newtonsoft.Json;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using Sabio.Services.Interfaces;

namespace Sabio.Services
{
    public class GoogleAnalyticsReportService : IGoogleAnalyticsReportService
    {
        private ServiceAccountCred _acc;
        private GoogleCredential _credential;
        private AnalyticsReportingService _client;

        public GoogleAnalyticsReportService(IOptions<ServiceAccountCred> acc)
        {
            _acc = acc.Value;
            string keyFilePath = Path.Combine("makai-378802-f9efdebb1411.json");
            _credential = GoogleCredential.FromFile(keyFilePath).CreateScoped(new[] { AnalyticsReportingService.Scope.AnalyticsReadonly });
            _client = new AnalyticsReportingService(
                  new BaseClientService.Initializer
                  {
                      HttpClientInitializer = _credential
                  });
        }

        public GetReportsResponse GetAnalyticsReport(GoogleGetReportRequest model)
        {
            string viewIdPath = Path.Combine("makai-378802-f9efdebb1411.json");
            string file = System.IO.File.ReadAllText(viewIdPath);
            dynamic jsonFile = JsonConvert.DeserializeObject(file);

            string viewId = jsonFile.view_id;

            ReportRequest reportRequest = new ReportRequest
            {
                ViewId = viewId,
                DateRanges = new List<DateRange>
                {
                    new DateRange
                    {
                    StartDate = model.StartDate,
                    EndDate = model.EndDate,
                    }
                },
                Dimensions = model.Dimensions,
                Metrics = model.Metrics
            };

            List<ReportRequest> requests = new List<ReportRequest>();
            requests.Add(reportRequest);

            GetReportsRequest getReport = new GetReportsRequest() { ReportRequests = requests };
            GetReportsResponse response = _client.Reports.BatchGet(getReport).Execute();
            return response;
        }
    }

}