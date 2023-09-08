using Microsoft.Extensions.Options;
using Sabio.Models.AppSettings;
using Sabio.Models.Domain;
using Sabio.Models.Domain.SalesTaxes;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface ISalesTaxService
    {
        Task<List<int>> Add(List<int> postalCodes);

    }
}