using Sabio.Models;
using Sabio.Models.Domain.StandCodes;
using System;
using System.Data;

namespace Sabio.Services
{
    public interface IStandCodeService
    {
        Guid Add(int userId, int standId);
        StandCode GetByCode(string ucode);
        StandCode GetById(int id);
        Paged<StandCode> GetPaginated(int pageIndex, int pageSize);
        StandCode MapSingleStandCode(IDataReader reader, ref int startingIndex);
        void Delete(int id);
    }
}