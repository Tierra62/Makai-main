using Google.Apis.AnalyticsReporting.v4.Data;
using Sabio.Models.Requests.GoogleReportRequest;

namespace Sabio.Services
{
    public interface IGoogleAnalyticsReportService
    {
        GetReportsResponse GetAnalyticsReport(GoogleGetReportRequest model);
    }
}