using Sabio.Models;
using Sabio.Models.Domain.Locations;
using Sabio.Models.Requests.Locations;
using System.Collections.Generic;
using System.Data;

namespace Sabio.Services
{
    public interface ILocationService
    {
        int Add(LocationAddRequest model, int userId);
        void Delete(int id);
        List<Location> GetByLocationType(int locationTypeId);
        Paged<Location> GetByCreatedBy(int pageIndex, int pageSize, int createdBy);
        void Update(LocationUpdateRequest model, int userId);
        Location MapSingleLocation(IDataReader reader, ref int startingIndex);
    }
}