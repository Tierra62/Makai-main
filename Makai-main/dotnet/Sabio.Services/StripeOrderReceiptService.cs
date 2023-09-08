using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain.Stripe;
using Sabio.Models;
using Sabio.Models.Requests.Stripe;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class StripeOrderReceiptService : IStripeOrderReceiptService
    {
        public IDataProvider _data = null;
        public StripeOrderReceiptService(IDataProvider data)
        {
            _data = data;
        }
        public int AddOrder(OrderReceiptRequest order, int userId)
        {
            int id = 0;
            string procName = "[dbo].[StripeTransactions_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection data)
            {
                AddCommonParams(order, data);
                data.AddWithValue("@UserId", userId);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                data.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@id"].Value;
                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }

        public List<OrderReceipt> GetAll()
        {
            
            List<OrderReceipt> result = null;
            string procName = "[dbo].[StripeTransactions_SelectAll]";
            OrderReceipt order = null;

            _data.ExecuteCmd(
                procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    order = MapSingleOrder(reader, ref startingIndex);

                    if (result == null)
                    {
                        result = new List<OrderReceipt>();
                    }
                    result.Add(order);
                });
            return result;
        }
        public Paged<OrderReceipt> GetAllByUserId(int pageIndex, int pageSize, int userId)
        {
            Paged<OrderReceipt> pagedResult = null;
            List<OrderReceipt> result = null;
            string procName = "[dbo].[StripeTransactions_SelectAllbyUserId]";
            OrderReceipt order = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                    parameterCollection.AddWithValue("@UserId", userId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    order = MapSingleOrder(reader, ref startingIndex);
                    totalCount = reader.GetSafeInt32(startingIndex++);

                    if (result == null)
                    {
                        result = new List<OrderReceipt>();
                    }
                    result.Add(order);
                });
            if (result != null)
            {
                pagedResult = new Paged<OrderReceipt>(result, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }
        public Paged<OrderReceipt> GetAllByRecipient(int pageIndex, int pageSize, string recipientId)
        {
            Paged<OrderReceipt> pagedResult = null;
            List<OrderReceipt> result = null;
            string procName = "[dbo].[StripeTransactions_SelectAllbyRecipient]";
            OrderReceipt order = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                    parameterCollection.AddWithValue("@Recipient", recipientId);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    order = MapSingleOrder(reader, ref startingIndex);
                    totalCount = reader.GetSafeInt32(startingIndex++);

                    if (result == null)
                    {
                        result = new List<OrderReceipt>();
                    }
                    result.Add(order);
                });
            if (result != null)
            {
                pagedResult = new Paged<OrderReceipt>(result, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }

        public OrderReceipt GetOrderById(int id)
        {
            string procName = "[dbo].[StripeTransactions_SelectById]";
            OrderReceipt order = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                order = MapSingleOrder(reader, ref startingIndex);
            });
            return order;

        }



        private static OrderReceipt MapSingleOrder(IDataReader reader, ref int startingIndex)
        {
            OrderReceipt order = new OrderReceipt();
            order.Id = reader.GetSafeInt32(startingIndex++);
            order.UserId = reader.GetSafeInt32(startingIndex++);
            order.FirstName = reader.GetSafeString(startingIndex++);
            order.LastName = reader.GetSafeString(startingIndex++);
            order.Email = reader.GetSafeString(startingIndex++);
            order.StripeSessionId = reader.GetSafeString(startingIndex++);
            order.Recipient = reader.GetSafeString(startingIndex++);
            order.AmountTotal = reader.GetSafeInt32(startingIndex++);
            order.PaymentStatus = reader.GetSafeString(startingIndex++);
            order.TransactionType = reader.GetSafeString(startingIndex++);
            order.DateCreated = reader.GetSafeDateTime(startingIndex++);
            order.DateModified = reader.GetSafeDateTime(startingIndex++);
            return order;
        }

        private static void AddCommonParams(OrderReceiptRequest order, SqlParameterCollection data)
        {
            data.AddWithValue("@StripeSessionId", order.StripeSessionId);
            data.AddWithValue("@Recipient", order.Recipient);
            data.AddWithValue("@AmountTotal", order.AmountTotal);
            data.AddWithValue("@PaymentStatus", order.PaymentStatus);
            data.AddWithValue("@TransactionType", order.TransactionType);
        }
    }
}
