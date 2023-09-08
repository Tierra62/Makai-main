using Sabio.Models.Domain.InsuranceOptions;
using Sabio.Models.Requests.InsuranceOptions;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IInsuranceOptionService
    {
        InsuranceOption GetById(int id);
        List<InsuranceOption> GetAll();
        int Add(InsuranceOptionAddRequest model, int userId);
        void Update(InsuranceOptionUpdateRequest model, int userId);
        void Delete(int id, int userId);
    }
}