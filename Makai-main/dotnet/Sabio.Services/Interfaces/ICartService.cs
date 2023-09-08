using Sabio.Models.Domain.Carts;
using Sabio.Models.Requests.Carts;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface ICartService
    {
        int AddCart(CartAddRequest model, int userId);
        void DeleteCart(int id, int userId);
        List<Cart> GetCartByCurrentUser(int userId);
        void UpdateCart(CartUpdateRequest model, int userId);
    }
}