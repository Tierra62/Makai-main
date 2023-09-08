using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Stands;
using Sabio.Models.Requests.Stands;
using System.Collections.Generic;
using System.Data;

namespace Sabio.Services.Interfaces
{
    public interface IStandService
    {
        int Add(StandAddRequest model, int userId);
        void Update(StandUpdateRequest model, int userId);
        void Delete(int id);
        List<StandDetails> GetByUserId(int userId);
        Paged<StandDetails> GetByGeo(StandGeoRequest model);
        StandDetails MapSingleStand(IDataReader reader, ref int startingIndex);
        List<StandDetails> GetAllV2();
        List<StandDetails> GetAll();
    }
}