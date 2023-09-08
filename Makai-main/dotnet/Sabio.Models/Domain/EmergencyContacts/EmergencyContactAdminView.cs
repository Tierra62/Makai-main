namespace Sabio.Models.Domain.EmergencyContacts
{
    public class EmergencyContactAdminView
    {
        public BaseUser UserInfo { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
    }
}
