using Sabio.Models;
using Sabio.Models.Domain.Appointments;
using Sabio.Models.Requests.Appointments;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IAppointmentsService
    {
        List<Appointment> GetAll();
        int Add(AppointmentAddRequest appointmentRequestModel, int userId);
        Appointment GetById(int id);
        Paged<Appointment> GetByUserId(int pageIndex, int pageSize, int userId);
        void Update(AppointmentUpdateRequest updateAppointmentRequestModel, int userId);
        void UpdateIsCancelled(int id, int userId);
        void UpdateIsConfirmed(AppointmentUpdateIsConfirmedRequest updateAppointmentRequestModel, int userId);
    }
}