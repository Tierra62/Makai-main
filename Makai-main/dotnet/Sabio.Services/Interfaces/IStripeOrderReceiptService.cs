using Sabio.Models.Domain.Stripe;
using Sabio.Models;
using Sabio.Models.Requests.Stripe;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IStripeOrderReceiptService
    {
        int AddOrder(OrderReceiptRequest order, int userId);
        List<OrderReceipt> GetAll();
        OrderReceipt GetOrderById(int id);
        Paged<OrderReceipt> GetAllByUserId(int pageIndex, int pageSize, int userId);
        Paged<OrderReceipt> GetAllByRecipient(int pageIndex, int pageSize, string recipientId);

    }
}