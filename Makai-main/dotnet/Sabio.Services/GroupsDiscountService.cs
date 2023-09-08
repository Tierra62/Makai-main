using Sabio.Data.Providers;
using Sabio.Models.Requests.GroupDiscount;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Requests.Orders;
using Sabio.Models.Domain.GroupDiscounts;
using Sabio.Data;
using Sabio.Models.Domain.Orders;
using Sabio.Models;
using Sabio.Models.Domain;

namespace Sabio.Services
{
    public class GroupsDiscountService :IGroupDiscountService 
    {

        IDataProvider _data = null;
       

        public GroupsDiscountService(IDataProvider data)
        {
            _data = data; 
     
        }

        public int Add(GroupDiscountAddRequest model,int userId)
        {
            string procName = "[dbo].[GroupDiscounts_InsertV2]";
            int id = 0;

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
             {
                 AddCommonParams(model, col);
                 col.AddWithValue("@CurrentUserId", userId); 
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

        public GroupDiscount Get(int Id) 
        {
            string procName = "[dbo].[GroupDiscounts_SelectById]";

            GroupDiscount groupDiscount = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)

            {

                paramCollection.AddWithValue("@Id", Id);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                        groupDiscount = MapGroupDiscount(reader, ref startingIndex);
            }
            );
            return groupDiscount;

        }

        public void UpdateIsDeleted(int id, bool isDeleted)
        {
            string procName = "[dbo].[GroupDiscounts_Update_IsDeleted]";
            _data.ExecuteNonQuery(procName,
            inputParamMapper: delegate (SqlParameterCollection collection)
            {
               
                collection.AddWithValue("@Id", id);
                collection.AddWithValue("@IsDeleted",isDeleted);


            }, returnParameters: null);
        }

        public void UpdateIsActive(int id, bool isActive)
        {
            string procName = "[dbo].[GroupDiscounts_Update_IsActive]";
            _data.ExecuteNonQuery(procName,
            inputParamMapper: delegate (SqlParameterCollection collection)
            {

                collection.AddWithValue("@Id", id);
                collection.AddWithValue("@isActive", isActive);


            }, returnParameters: null);
        }

        public void Update(GroupDiscountUpdateRequest request, int userId)
        {
            string procName = "[dbo].[GroupDiscounts_UpdateV2]";
            
            _data.ExecuteNonQuery(procName,
            inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@CurrentUserId", userId);
                AddCommonParams(request, collection);
                collection.AddWithValue("@Id", request.Id);
                

            }, returnParameters: null);
        }

        public Paged<GroupDiscount> GetByPartnerId(int userId, int pageIndex, int pageSize)
        {
            Paged<GroupDiscount> pagedList = null;
            List<GroupDiscount> list = null;
            int totalCount = 0;
            string procName = "[dbo].[GroupDiscounts_SelectByPartnerId_PaginatedV2]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@CurrentUserId", userId);
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                

            },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;

                    GroupDiscount aGroupDiscount = MapGroupDiscount(reader,ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex);
                    }
                    if (list == null)
                    {
                        list = new List<GroupDiscount>(pageSize);
                    }
                    list.Add(aGroupDiscount);
                });

            if (list != null)
            {
                pagedList = new Paged<GroupDiscount>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<GroupDiscount> GetByDate(DateTime startDate,DateTime endDate, int pageIndex, int pageSize)
        {
            Paged<GroupDiscount> pagedList = null;
            List<GroupDiscount> list = null;
            int totalCount = 0;
            string procName = "[dbo].[GroupDiscounts_SelectByDate_Paginated]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@StartDate", startDate);
                col.AddWithValue("@EndDate", endDate);
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);

            },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;

                    GroupDiscount aGroupDiscount = MapGroupDiscount(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex);
                    }
                    if (list == null)
                    {
                        list = new List<GroupDiscount>(pageSize);
                    }
                    list.Add(aGroupDiscount);
                });

            if (list != null)
            {
                pagedList = new Paged<GroupDiscount>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        private static GroupDiscount MapGroupDiscount(IDataReader reader,ref int startingIndex)
        {
            GroupDiscount aGroupDiscount = new GroupDiscount();


         

            aGroupDiscount.Id = reader.GetSafeInt32(startingIndex++);
            aGroupDiscount.Name = reader.GetSafeString(startingIndex++);
            aGroupDiscount.Description = reader.GetSafeString(startingIndex++);
            aGroupDiscount.PartnerId = reader.GetSafeInt32(startingIndex++);
            aGroupDiscount.DiscountType = new LookUp();
            aGroupDiscount.DiscountType.Id = reader.GetSafeInt32(startingIndex++);
            aGroupDiscount.DiscountType.Name = reader.GetSafeString(startingIndex++);
            aGroupDiscount.Value = reader.GetSafeInt32(startingIndex++);
            aGroupDiscount.StartDate = reader.GetSafeDateTime(startingIndex++);
            aGroupDiscount.EndDate = reader.GetSafeDateTime(startingIndex++);
            aGroupDiscount.IsActive = reader.GetSafeBool(startingIndex++);
            aGroupDiscount.IsDeleted = reader.GetSafeBool(startingIndex++);
            aGroupDiscount.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aGroupDiscount.DateModified = reader.GetSafeDateTime(startingIndex++);

            return aGroupDiscount;

        }

        private static void AddCommonParams(GroupDiscountAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@DiscountTypeId", model.DiscountTypeId);
            col.AddWithValue("@Value", model.Value);
            col.AddWithValue("@StartDate", model.StartDate);
            col.AddWithValue("@EndDate", model.EndDate);
           
          
        }
    }
}

