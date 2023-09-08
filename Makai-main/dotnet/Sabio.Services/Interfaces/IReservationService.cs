using Sabio.Models.Domain.Reservations;
using Sabio.Models;
using Sabio.Models.Requests.Reservations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Requests;

namespace Sabio.Services.Interfaces
{
    public interface IReservationService
    {
        int Add(ReservationAddRequest model, int userId);
        Paged<Reservation> GetPaginated(int pageIndex, int pageSize);
        Reservation GetById(int id);
        Paged<Reservation> GetByCreatedBy(int pageIndex, int pageSize, int creator);
        void Update(ReservationUpdateRequest model, int userId);
        void UpdateStatusByProductId(int productId, int statusId);
        void UpdateStatusByChargeId(string chargeId, int statusId);
    }
}
