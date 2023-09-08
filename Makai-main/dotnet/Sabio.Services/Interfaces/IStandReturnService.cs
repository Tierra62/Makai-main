using Sabio.Models;
using Sabio.Models.Domain.StandReturns;
using Sabio.Models.Requests.StandReturns;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IStandReturnService
    {
        int Add(StandReturnAddRequest model, int userId);
        void Update(ImageUpdateRequest model);
        Paged<StandReturnDetails> GetByUserId(int userId, int pageIndex, int pageSize);
        Paged<StandReturnDetails> GetByStandId(int standId, int pageIndex, int pageSize);
        Paged<StandReturnDetails> GetAll( int pageIndex, int pageSize);
        StandReturnDetails MapSingleStandReturn(IDataReader reader, ref int startingIndex);
    }
}
