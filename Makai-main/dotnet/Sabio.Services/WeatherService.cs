using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Sabio.Data.Providers;
using Sabio.Models.AppSettings;
using Sabio.Models.Domain.WeatherModels;
using Sabio.Services.Interfaces;

public class WeatherService : IWeatherService
{
    IDataProvider _data = null;
    private ApiKeys _apiKeys;
    public WeatherService(IOptions<ApiKeys> apiKeys, IDataProvider data)

    {

         _apiKeys = apiKeys.Value;
        _data = data;
    }
    public WeatherResponse GetCurrent(string q)
    {
         WeatherResponse weather = null;
        using var client = new HttpClient();
        var url = $"http://api.weatherapi.com/v1/current.json?key={_apiKeys.WeatherApiApiKey}={q}";
        var response = client.GetAsync(url).Result;

        if (response.IsSuccessStatusCode)
        {
            var weatherJsonObject = response.Content.ReadAsStringAsync().Result;
            weather = Newtonsoft.Json.JsonConvert.DeserializeObject<WeatherResponse>(weatherJsonObject);
        }
        return weather;
    }
}

