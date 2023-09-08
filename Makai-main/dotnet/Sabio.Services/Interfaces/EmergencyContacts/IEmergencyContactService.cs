using Sabio.Models.Domain.EmergencyContacts;
using Sabio.Models.Requests.EmergencyContacts;

namespace Sabio.Services.Interfaces.EmergencyContacts
{
    public interface IEmergencyContactService
    {
        int Add(EmergencyContactAddRequest model, int userId);
        void Delete(int id);
        EmergencyContact GetByUserId(int userId);
        void Update(EmergencyContactUpdateRequest model, int userId);
    }
}