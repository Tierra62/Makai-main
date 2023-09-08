using Sabio.Models;
using Sabio.Models.Domain.GroupDiscounts;
using Sabio.Models.Requests.Appointments;
using Sabio.Models.Requests.GroupDiscount;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IGroupDiscountService 
    {
         int Add(GroupDiscountAddRequest GroupDiscountAddRequestModel,int userId);
         GroupDiscount Get(int Id);
         void Update(GroupDiscountUpdateRequest request,int userId);
         Paged<GroupDiscount> GetByPartnerId(int userId, int pageIndex, int pageSize);
         Paged<GroupDiscount> GetByDate(DateTime startDate, DateTime endDate, int pageIndex, int pageSize);
         void UpdateIsActive(int id, bool isActive);
         void UpdateIsDeleted(int id, bool isDeleted);
    }
}
