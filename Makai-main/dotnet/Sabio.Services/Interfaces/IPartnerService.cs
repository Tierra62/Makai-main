using Sabio.Models;
using Sabio.Models.Domain.Partners;
using Sabio.Models.Requests.Partners;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Sabio.Services.Interfaces
{
    public interface IPartnerService
    {
        int Add(int userId, PartnerAddRequest request);
        void Delete(int id);
        Partner Get(int id);
        Paged<Partner> GetAllPaginated(int pageIndex, int pageSize);
        List<Partner> GetAll();
        Paged<Partner> SearchPaginated(int pageIndex, int pageSize, string query);
        void Update(int userId, PartnerUpdateRequest update);
        PartnerDetails GetDetails(int id);
        Paged<PartnerDetails> GetAllDetails(int pageIndex, int pageSize);
        Paged<PartnerDetails> SearchPaginatedDetails(int pageIndex, int pageSize, string query);
        Partner MapSinglePartner(IDataReader reader, ref int startingIndex);
    }
}