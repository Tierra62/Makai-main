using Sabio.Models;
using Sabio.Models.Domain.Orders;
using Sabio.Models.Requests.Orders;
using System;
using System.Collections.Generic;

namespace Sabio.Services.Orders
{
    public interface IOrderService
    {
        Paged<Order> GetStandById(int pageIndex, int pageSize, int standId);
        Paged<Order> GetAllOrders(int pageIndex, int pageSize);
        Paged<Order> GetOrdersByUserId(int pageIndex, int pageSize, int userId);
        void DeleteById(int id);
        void UpdateOrder(OrderUpdateRequest model, int userId);
        int AddOrder(OrderAddRequest model, int userId);
        void UpdateOrderStatus(int id, int statusId, int userId);
        Paged<OrderPaymentHistory> GetCurrentUserPaymentHistory(int pageIndex, int pageSize, int userId);
        void CheckOutOrderItem(int orderItemId, int userId);
        void CheckInOrderItem(int orderItemId, int userId);
        void CheckInWholeOrder(int orderId, int userId);
        void CheckOutWholeOrder(int orderId, int userId);
        Paged<OrderItemV2> GetOrderItemsByUserId(int pageIndex, int pageSize, int userId);
    }
}