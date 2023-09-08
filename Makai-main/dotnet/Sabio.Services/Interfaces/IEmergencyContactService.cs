using Sabio.Models.Domain.Appointments;
using Sabio.Models;
using Sabio.Models.Domain.EmergencyContacts;
using Sabio.Models.Requests.EmergencyContacts;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IEmergencyContactService
    {
        int Add(EmergencyContactAddRequest model, int userId);
        void Delete(int id);
        List<EmergencyContact> GetByUserId(int userId);
        Paged<EmergencyContactAdminView> GetByUserIdPaginated(int pageIndex, int pageSize, int userId);
        void Update(EmergencyContactUpdateRequest model, int userId);
    }
}