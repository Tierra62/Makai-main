using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.AppSettings;
using Sabio.Models.Domain;
using Sabio.Models.Domain.SalesTaxes;
using Sabio.Models.Requests;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Http;
using System.Reflection.PortableExecutable;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Sabio.Services
{
    public class SalesTaxService : ISalesTaxService
    {
         
        
        HttpClient _client;
        XRapidAPI _xRapidApi;
        IDataProvider _data = null;

        public SalesTaxService(IDataProvider data, IOptions<XRapidAPI> xRapidApi)
        {
            _data = data;
            _xRapidApi = xRapidApi.Value;
            _client = new HttpClient();

        }
        public async Task<List<int>> Add(List<int> postalCodes)
        {
            List<int> ids = new List<int>();

            foreach (int postalCode in postalCodes)
            {
                int id = 0;
                SalesTaxResponse salesTax = await GetSalesTaxDataFromApi(postalCode);

                if (salesTax != null)
                {
                    id = InsertToDb(salesTax, postalCode);
                    ids.Add(id);
                }
            } 

            return ids;

        }

        private async Task<SalesTaxResponse> GetSalesTaxDataFromApi(int postalCode)
        {
            SalesTaxResponse salesTax = null;
            string url = $"{_xRapidApi.SalesUrl}{postalCode}";
            HttpRequestMessage msg = new HttpRequestMessage(HttpMethod.Get, url);

            msg.Headers.Add("X-RapidAPI-Key", _xRapidApi.Key);

            try
            {
                HttpResponseMessage res = await _client.SendAsync(msg);

                string content = await res.Content.ReadAsStringAsync();

                if (content != null)
                {
                    salesTax = JsonConvert.DeserializeObject<SalesTaxResponse>(content);
                }
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding the postal code.", ex);
            }

            return salesTax;
        }

        private int InsertToDb(SalesTaxResponse model, int postalCode)
        {
            int id = 0;

            var procName = "[dbo].[SalesTax_Insert]";
                _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@PostalCode", postalCode);
                    col.AddWithValue("@State", model.state);
                    col.AddWithValue("@StateRate", model.state_rate);
                    col.AddWithValue("@CombinedRate", model.estimated_combined_rate);
                    col.AddWithValue("@CountyRate", model.estimated_county_rate);
                    col.AddWithValue("@CityRate", model.estimated_city_rate);
                    col.AddWithValue("@SpecialRate", model.estimated_special_rate);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;
                    col.Add(idOut);
                   
                }, returnParameters: delegate(SqlParameterCollection returnCol) {

                    object objectId = returnCol["@Id"].Value;
                    int.TryParse(objectId.ToString(), out id);

                } );

            return id;
        }

   
    }
}
