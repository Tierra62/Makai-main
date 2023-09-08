using Newtonsoft.Json;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Orders;
using Sabio.Models.Domain.Products;
using Sabio.Models.Requests.Orders;
using Sabio.Services.Interfaces;
using sib_api_v3_sdk.Api;
using Stripe;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Orders
{
    public class OrderService : IOrderService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper= null;
        public OrderService(IDataProvider data, IBaseUserMapper userMapper)
        {
            _data = data;
            _userMapper = userMapper;
        }
        public Paged<Order> GetStandById(int pageIndex, int pageSize, int standId)
        {
            Paged<Order> pagedList = null;
            List<Order> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Orders_SelectByStandId_Paginated]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@StandId", standId);
                AddCommonPaginationParams(pageIndex, pageSize, col);
            },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;

                    Order order = MapSingleOrder(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex);
                    }
                    if (list == null)
                    {
                        list = new List<Order>(pageSize);
                    }
                    list.Add(order);
                });

            if (list != null)
            {
                pagedList = new Paged<Order>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public Paged<Order> GetAllOrders(int pageIndex, int pageSize)
        {
            Paged<Order> pagedList = null;
            List<Order> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Orders_SelectAll_Paginated]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonPaginationParams(pageIndex, pageSize, col);
            },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;

                    Order order = MapSingleOrder(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex);
                    }
                    if (list == null)
                    {
                        list = new List<Order>(pageSize);
                    }
                    list.Add(order);
                });
            if (list != null)
            {
                pagedList = new Paged<Order>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public Paged<OrderPaymentHistory> GetCurrentUserPaymentHistory(int pageIndex, int pageSize, int userId)
        {
            Paged<OrderPaymentHistory> pagedItems = null;
            List<OrderPaymentHistory> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Orders_SelectPaymentHistory_Paginated]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection inputParams)
                {
                    inputParams.AddWithValue("@UserId", userId);
                    AddCommonPaginationParams(pageIndex, pageSize, inputParams);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int starting = 0;
                    OrderPaymentHistory history = MapSinglePaymentHistory(reader,ref starting);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(starting++);
                    }
                    if (list == null)
                    {
                        list = new List<OrderPaymentHistory>();
                    }
                    list.Add(history);
                });
            if (list != null)
            {
                pagedItems = new Paged<OrderPaymentHistory>(list, pageIndex, pageSize, totalCount);
            }
            return pagedItems;
        }
        public Paged<Order> GetOrdersByUserId(int pageIndex, int pageSize, int userId)
        {
            Paged<Order> pagedList = null;
            List<Order> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Orders_SelectByUserId_Paginated]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@UserId", userId);
                AddCommonPaginationParams(pageIndex, pageSize, col);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                Order order = MapSingleOrder(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex);
                }
                if (list == null)
                {
                    list = new List<Order>(pageSize);
                }
                list.Add(order);
            });

            if (list != null)
            {
                pagedList = new Paged<Order>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }


        public Paged<OrderItemV2> GetOrderItemsByUserId(int pageIndex, int pageSize, int userId)
        {
            Paged<OrderItemV2> pagedList = null;
            List<OrderItemV2> list = null;
            int totalCount = 0;
            string procName = "[dbo].[OrderItems_SelectByUserId_Paginated]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@UserId", userId);
                AddCommonPaginationParams(pageIndex, pageSize, col);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                OrderItemV2 order = MapSingleOrderItem(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex);
                }
                if (list == null)
                {
                    list = new List<OrderItemV2>(pageSize);
                }
                list.Add(order);
            });

            if (list != null)
            {
                pagedList = new Paged<OrderItemV2>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public void DeleteById(int id)
        {
            string procName = "[dbo].[Orders_DeleteById]";
            _data.ExecuteNonQuery(procName,
               inputParamMapper: delegate (SqlParameterCollection col)
               {
                   col.AddWithValue("@Id", id);
               });
        }
        public void UpdateOrder(OrderUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Orders_Update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("Id", model.Id);
                    col.AddWithValue("@UserId", userId);
                    col.AddWithValue("@TotalPriceInCents", model.TotalPriceInCents);
                    col.AddWithValue("@TotalPriceWithTax", model.TotalPriceWithTax);
                    col.AddWithValue("@StripeSessionId", model.StripeSessionId);
                    col.AddWithValue("@OrderStatusId", model.OrderStatusId);
                },
                returnParameters: null);
        }
        public void UpdateOrderStatus(int id, int statusId, int userId)
        {
            string procName = "[dbo].[Orders_UpdateStatusId]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                    col.AddWithValue("@UserId", userId);
                    col.AddWithValue("@StatusId", statusId);
                },
                returnParameters: null);
        }
        public void CheckOutOrderItem(int orderItemId, int userId) {
            string procName = "[dbo].[OrderItems_CheckOut]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection inputParams)
                {
                    AddCommonCheckingParams(orderItemId, userId, inputParams);
                },
                returnParameters: null);
        }

        public void CheckInOrderItem(int orderItemId, int userId)
        {
            string procName = "[dbo].[OrderItems_CheckIn]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection inputParams)
                {
                    AddCommonCheckingParams(orderItemId, userId, inputParams);
                },
                returnParameters: null);
        }
        public void CheckOutWholeOrder(int orderId, int userId)
        {
            string procName = "[dbo].[Orders_CheckOut]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection inputParams)
                {
                    AddCommonCheckingParams(orderId, userId, inputParams);
                },
                returnParameters: null);
        }
        public void CheckInWholeOrder(int orderId, int userId)
        {
            string procName = "[dbo].[Orders_CheckIn]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection inputParams)
                {
                    AddCommonCheckingParams(orderId, userId, inputParams);
                },
                returnParameters: null);
        }
        public int AddOrder(OrderAddRequest model, int userId)
        {
            string procName = "[dbo].[Orders_Insert]";
            int id = 0;
            DataTable orderItemsTable = MapOrderItemsToTable(model.OrderItems);
            _data.ExecuteNonQuery(procName,
            inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@UserId", userId);
                col.AddWithValue("@BatchOrderItems", orderItemsTable);
                col.AddWithValue("@TotalPriceInCents", model.TotalPriceInCents);
                if(model.TotalPriceWithTax == 0)
                {
                    col.AddWithValue("@TotalPriceWithTax", null);
                }
                else
                {
                    col.AddWithValue("@TotalPriceWithTax", model.TotalPriceWithTax);
                }
                col.AddWithValue("@StripeSessionId", model.StripeSessionId);
                col.AddWithValue("@OrderStatusId", model.OrderStatusId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oldId = returnCollection["@Id"].Value;
                int.TryParse(oldId.ToString(), out id);
            });

            return id;
        }
        private DataTable MapOrderItemsToTable(List<OrderItemAddRequest> orderItems)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("ProductId", typeof(int));
            dt.Columns.Add("PriceInCents", typeof(int));
            dt.Columns.Add("PriceWithTax", typeof(decimal));
            dt.Columns.Add("EstimatedStartTime", typeof(DateTime));
            dt.Columns.Add("EstimatedStopTime", typeof(DateTime));
            foreach(OrderItemAddRequest orderItem in orderItems)
            {
                int starting = 0;
                DataRow dr = dt.NewRow();
                dr.SetField(starting++, orderItem.ProductId);
                dr.SetField(starting++, orderItem.PriceInCents);
                if (orderItem.PriceWithTax == 0)
                {
                    dr.SetField(starting++, System.DBNull.Value);
                }
                else
                {
                    dr.SetField(starting++, orderItem.PriceWithTax);
                }
                dr.SetField(starting++, orderItem.EstimatedStartTime);
                dr.SetField(starting++, orderItem.EstimatedStopTime);

                dt.Rows.Add(dr);
            }
            return dt;
        }
        public Order MapSingleOrder(IDataReader reader, ref int startingIndex)
        {
            Order order = new Order();

            order.Id = reader.GetSafeInt32(startingIndex++);
            order.OrderItems = reader.DeserializeObject<List<OrderItem>>(startingIndex++);
            order.InsurancePriceInCents = reader.GetSafeInt32(startingIndex++);
            order.TotalPriceInCents = reader.GetSafeInt32(startingIndex++);
            order.TotalPriceWithTax = reader.GetSafeDecimal(startingIndex++);
            order.OrderStatus = new LookUp();
            order.OrderStatus.Id = reader.GetSafeInt32(startingIndex++);
            order.OrderStatus.Name = reader.GetSafeString(startingIndex++);
            order.CreatedBy = _userMapper.MapUser(reader, ref startingIndex);
            order.ModifiedBy = _userMapper.MapUser(reader,ref startingIndex);
            order.DateCreated = reader.GetSafeDateTime(startingIndex++);
            order.DateModified = reader.GetSafeDateTime(startingIndex++);

            return order;
        }
        private OrderItemV2 MapSingleOrderItem(IDataReader reader, ref int startingIndex)
        {
            OrderItemV2 orderItem = new OrderItemV2();

            orderItem.Id = reader.GetSafeInt32(startingIndex++);
            orderItem.OrderId = reader.GetSafeInt32(startingIndex++);
            orderItem.Product = reader.DeserializeObject<BaseProduct>(startingIndex++);
            orderItem.PriceInCents = reader.GetSafeInt32(startingIndex++);
            orderItem.PriceWithTax = reader.GetSafeDecimal(startingIndex++);
            orderItem.EstimatedStartTime = reader.GetSafeDateTime(startingIndex++);
            orderItem.EstimatedStopTime = reader.GetSafeDateTime(startingIndex++);
            orderItem.ActualStartTime = reader.GetSafeDateTime(startingIndex++);
            orderItem.ActualStopTime = reader.GetSafeDateTime(startingIndex++);
            orderItem.InsurancePriceInCents = reader.GetSafeInt32(startingIndex++);
            orderItem.TotalPriceInCents = reader.GetSafeInt32(startingIndex++);
            orderItem.TotalPriceWithTax = reader.GetSafeDecimal(startingIndex++);
            orderItem.OrderStatus = new LookUp();
            orderItem.OrderStatus.Id = reader.GetSafeInt32(startingIndex++);
            orderItem.OrderStatus.Name = reader.GetSafeString(startingIndex++);
            orderItem.DateCreated = reader.GetSafeDateTime(startingIndex++);
            orderItem.DateModified = reader.GetSafeDateTime(startingIndex++);

            return orderItem;
        }
        private static void AddCommonPaginationParams(int pageIndex, int pageSize, SqlParameterCollection col)
        {
            col.AddWithValue("@PageIndex", pageIndex);
            col.AddWithValue("@PageSize", pageSize);
        }
        private static OrderPaymentHistory MapSinglePaymentHistory(IDataReader reader, ref int starting)
        {
            OrderPaymentHistory paymentHistory = new OrderPaymentHistory();
            paymentHistory.Id = reader.GetSafeInt32(starting++);
            paymentHistory.InsurancePriceInCents = reader.GetSafeInt32(starting++);
            paymentHistory.TotalPriceInCents = reader.GetSafeInt32(starting++);
            paymentHistory.TotalPriceWithTax = reader.GetSafeDecimal(starting++);
            paymentHistory.PaymentStatus = reader.GetSafeString(starting++);
            paymentHistory.TransactionType = reader.GetSafeString(starting++);
            paymentHistory.TransactionDateModified = reader.GetSafeDateTime(starting++);
            return paymentHistory;
        }

        private static void AddCommonCheckingParams(int id, int userId, SqlParameterCollection inputParams)
        {
            inputParams.AddWithValue("@UserId", userId);
            inputParams.AddWithValue("@Id", id);
        }
    }
}
