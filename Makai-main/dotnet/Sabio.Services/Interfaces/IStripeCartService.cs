using Sabio.Models.Domain.Products;

namespace Sabio.Services.Interfaces
{
    public interface IStripeCartService
    {
        Product GetProductById(int id);
    }
}