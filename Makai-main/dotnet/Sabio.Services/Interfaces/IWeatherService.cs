using Sabio.Models.AppSettings;
using Sabio.Models.Domain.WeatherModels;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IWeatherService
    {
        WeatherResponse GetCurrent(string q);
    }
}