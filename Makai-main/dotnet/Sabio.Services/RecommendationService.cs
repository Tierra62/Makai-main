using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Partners;
using Sabio.Models.Domain.Products;
using Sabio.Models.Domain.Recommendations;
using Sabio.Models.Domain.Reservations;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Recommendations;
using Sabio.Models.Requests.Reservations;
using Sabio.Services.Interfaces;
using Stripe;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class RecommendationService : IRecommendationService
    {
        IDataProvider _data = null;
        IAuthenticationService<int> _authService = null;
        ILookUpService _lookUpService = null;


        public RecommendationService(IDataProvider data, IAuthenticationService<int> authService, ILookUpService lookUpService)
        {
            _data = data;
            _authService = authService;
            _lookUpService = lookUpService;
        }

        public int Add(RecommendationAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[Recommendations_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                AddCommonParams(model, collection);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                collection.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });

            return id;
        }

        public Paged<Recommendation> Pagination(int pageIndex, int pageSize)
        {
            Paged<Recommendation> pagedList = null;
            List<Recommendation> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Recommendations_SelectAll_Paginated]";
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                Recommendation recommendation = MapSingleRecommendation(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetInt32(startingIndex);
                }

                if (list == null)
                {
                    list = new List<Recommendation>();
                }
                list.Add(recommendation);
            }
            );
            if (list != null)
            {
                pagedList = new Paged<Recommendation>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public List<Recommendation> GetByPartnerId(int partnerId)
        {
            string procName = "[dbo].[Recommendations_SelectByPartnerId]";
            List<Recommendation> list = null;
            
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramsCollection)
            {
                paramsCollection.AddWithValue("@PartnerId", partnerId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Recommendation recommendation = MapSingleRecommendation(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<Recommendation>();
                }
                list.Add(recommendation);
            });
            return list;
        }

        public void UpdateIsActive(bool isActive, int id, int userId)
        {
            
            string procName = "[dbo].[Recommendations_Update_IsActive]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", id);
                collection.AddWithValue("@IsActive", isActive);

            }, returnParameters: null);
        }

        public void UpdateIsDeleted(bool isDeleted, int id, int userId)
        {
            string procName = "[dbo].[Recommendations_Update_IsDeleted]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {

                collection.AddWithValue("@Id", id);
                collection.AddWithValue("@IsDeleted", isDeleted);

            }, returnParameters: null);
        }

        private Recommendation MapSingleRecommendation(IDataReader reader, ref int startingIndex)
        {   
            
            Recommendation aRecommendation = new Recommendation();         

            aRecommendation.Id = reader.GetSafeInt32(startingIndex++);

            aRecommendation.PartnerId = _lookUpService.MapSingleLookUp(reader, ref startingIndex);

            aRecommendation.SourceProductId = new BaseProduct();
            aRecommendation.SourceProductId.Id = reader.GetSafeInt32(startingIndex++);
            aRecommendation.SourceProductId.Name = reader.GetSafeString(startingIndex++);
            aRecommendation.SourceProductId.ProductType = reader.GetSafeInt32(startingIndex++);
            aRecommendation.SourceProductId.Description = reader.GetSafeString(startingIndex++);
            aRecommendation.SourceProductId.StandId = reader.GetSafeInt32(startingIndex++);
            aRecommendation.SourceProductId.Identifier = reader.GetSafeInt32(startingIndex++);
            aRecommendation.SourceProductId.HourlyPriceInCents = reader.GetSafeInt32(startingIndex++);

            aRecommendation.TargetProductId = new BaseProduct();
            aRecommendation.TargetProductId.Id = reader.GetSafeInt32(startingIndex++);
            aRecommendation.TargetProductId.Name = reader.GetSafeString(startingIndex++);
            aRecommendation.TargetProductId.ProductType = reader.GetSafeInt32(startingIndex++);
            aRecommendation.TargetProductId.Description = reader.GetSafeString(startingIndex++);
            aRecommendation.TargetProductId.StandId = reader.GetSafeInt32(startingIndex++);
            aRecommendation.TargetProductId.Identifier = reader.GetSafeInt32(startingIndex++);
            aRecommendation.TargetProductId.HourlyPriceInCents = reader.GetSafeInt32(startingIndex++);

            aRecommendation.Reason = reader.GetSafeString(startingIndex++);
            aRecommendation.IsActive = reader.GetSafeBool(startingIndex++);
            aRecommendation.IsDeleted = reader.GetSafeBool(startingIndex++);
            aRecommendation.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aRecommendation.DateModified = reader.GetSafeDateTime(startingIndex++);

            return aRecommendation;
        }
        private static void AddCommonParams(RecommendationAddRequest model, SqlParameterCollection collection)
        {
            collection.AddWithValue("@PartnerId", model.PartnerId);
            collection.AddWithValue("@SourceProductId", model.SourceProductId);
            collection.AddWithValue("@TargetProductId", model.TargetProductId);
            collection.AddWithValue("@Reason", model.Reason);

        }

    }

}
