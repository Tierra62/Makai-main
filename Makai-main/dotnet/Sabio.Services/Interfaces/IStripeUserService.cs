using Sabio.Models;
using Sabio.Models.Domain.Stripe;
using Sabio.Models.Requests.Stripe;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IStripeUserService
    {
        int AddStripeUser(StripeUserAddRequest user, int userId);
        void UpdateStripeUser(StripeUserUpdateRequest user, int userId);
        UserStripeAccount GetStripeUserById(int id);
        List<UserStripeAccount> GetAll();
        void Delete(int id);
    }
}