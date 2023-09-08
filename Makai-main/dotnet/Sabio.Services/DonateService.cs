using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using Sabio.Models.Domain.CharitableFunds;
using Sabio.Models.Requests.CharitableFunds;
using Sabio.Models.Domain.Donations;
using Sabio.Models.Requests.Donations;

namespace Sabio.Services
{
    public class DonateService : IDonateService
    {
        IDataProvider _data = null;
        ILookUpService _lookUpService = null;
        public DonateService(IDataProvider data, ILookUpService lookUpService)
        {
            _data = data;
            _lookUpService = lookUpService;
        }

        #region CHARITABLEFUNDS : GET METHODS

        public Paged<CharitableFund> GetAllCharitableFund(int pageIndex, int pageSize)
        {
            Paged<CharitableFund> pagedList = null;
            List<CharitableFund> list = null;
            int totalCount = 0;

            string procName = "[dbo].[CharitableFunds_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                CharitableFund charityFund = MapSingleCharitableFund(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<CharitableFund>(pageSize);
                }
                list.Add(charityFund);
            }
            );
            if (list != null)
            {
                pagedList = new Paged<CharitableFund>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public CharitableFund GetCharitableFund(int id)
        {
            CharitableFund charityFund = null;

            string procName = "[dbo].[CharitableFunds_Select_ById]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                charityFund = MapSingleCharitableFund(reader, ref startingIndex);
            }
            );
            return charityFund;
        }

        public CharitableFund GetByCreatorCharitableFund(int id)
        {
            CharitableFund charityFund = null;

            string procName = "[dbo].[CharitableFunds_Select_ByCreatedBy]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@CreatedBy", id);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                charityFund = MapSingleCharitableFund(reader, ref startingIndex);
            }
            );
            return charityFund;
        }
        #endregion

        #region CHARITABLEFUNDS : ADD, UPDATE, DELETE METHODS
        public int AddCharitableFund(CharitableFundAddRequest model, int createdBy)
        {
            int id = 0;

            string procName = "[dbo].[CharitableFunds_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParamsCharitableFund(model, col);
                col.AddWithValue("@CreatedBy", createdBy);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object objectId = returnCollection["@Id"].Value;

                int.TryParse(objectId.ToString(), out id);

            });
            return id;
        }

        public void UpdateCharitableFund(CharitableFundUpdateRequest request)
        {
            string procName = "[dbo].[CharitableFunds_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParamsCharitableFund(request, col);
                col.AddWithValue("@Id", request.Id);
            }, returnParameters: null);
        }


        public void DeleteCharitableFund(int id)
        {
            string procName = "[dbo].[CharitableFunds_Delete]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            }, returnParameters: null);
        }
        #endregion

        #region DONATIONS : GET METHODS
        public List<Donation> GetByCharityIdDonation(int id)
        {
            string procName = "[dbo].[Donations_Select_ByCharityId]";
            List<Donation> listOfDonations = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@CharityId", id);
            }
            , delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Donation donation = MapSingleDonation(reader, ref startingIndex);
                if (listOfDonations == null)
                {
                    listOfDonations = new List<Donation>();
                }
                listOfDonations.Add(donation);
            }
            );
            return listOfDonations;
        }

        public List<Donation> GetByCreatorDonation(int id)
        {
            string procName = "[dbo].[Donations_Select_ByCreatedBy]";
            List<Donation> listOfDonations = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@CreatedBy",id);
            }
            , delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Donation donation = MapSingleDonation(reader, ref startingIndex);
                if (listOfDonations == null)
                {
                    listOfDonations = new List<Donation>();
                }
                listOfDonations.Add(donation);
            }
            );
            return listOfDonations;
        }

        public List<DSummary> GetSummaryDonation(DateTime dateStart, DateTime dateEnd)
        {
            string procName = "[dbo].[Donations_Summary_ByDateRange]";
            List<DSummary> listOfDonations = null;

            _data.ExecuteCmd(procName, (param) =>
            {
                param.AddWithValue("@DateStart", dateStart);
                param.AddWithValue("@DateEnd", dateEnd);
            }
            , delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                DSummary donation = MapSingleDonationSummary(reader, ref startingIndex);
                if (listOfDonations == null)
                {
                    listOfDonations = new List<DSummary>();
                }
                listOfDonations.Add(donation);
            }
            );
            return listOfDonations;
        }
        #endregion

        #region DONATION :  ADD METHOD 
        public int AddDonation(DonationAddRequest model, int createdBy)
        {
            int id = 0;

            string procName = "[dbo].[Donations_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParamsDonation(model, col);
                col.AddWithValue("@CreatedBy", createdBy);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object objectId = returnCollection["@Id"].Value;

                int.TryParse(objectId.ToString(), out id);

            });
            return id;
        } 
        #endregion

        #region COMMON PARAMS AND MAPPING For charitableFunds and donations
        private static void AddCommonParamsCharitableFund(CharitableFundAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@Url", model.Url);
        }

        private static void AddCommonParamsDonation(DonationAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@CharitableFundId", model.CharitableFundId);
            col.AddWithValue("@OrderId", model.OrderId);
            col.AddWithValue("@UnitCost", model.UnitCost);
        }

        public CharitableFund MapSingleCharitableFund(IDataReader reader, ref int startingIndex)
        {
            CharitableFund charityFund = new CharitableFund();

            charityFund.Id = reader.GetSafeInt32(startingIndex++);
            charityFund.Name = reader.GetSafeString(startingIndex++);
            charityFund.Description = reader.GetSafeString(startingIndex++);
            charityFund.Url = reader.GetSafeString(startingIndex++);
            charityFund.IsDeleted = reader.GetSafeBool(startingIndex++);
            charityFund.UserFirstName = reader.GetSafeString(startingIndex++);
            charityFund.UserLastName = reader.GetSafeString(startingIndex++);
            charityFund.UserEmail = reader.GetSafeString(startingIndex++);
            charityFund.DateCreated = reader.GetSafeDateTime(startingIndex++);
            charityFund.DateModified = reader.GetSafeDateTime(startingIndex++);

            return charityFund;
        }

        public Donation MapSingleDonation(IDataReader reader, ref int startingIndex)
        {
            Donation donation = new Donation();

            donation.Id = reader.GetSafeInt32(startingIndex++);
            donation.CharitableFundId = reader.GetSafeInt32(startingIndex++);
            donation.CharitableFundName = reader.GetSafeString(startingIndex++);
            donation.OrderId = reader.GetSafeString(startingIndex++);
            donation.UnitCost = reader.GetSafeInt32(startingIndex++);
            donation.CreatedById = reader.GetSafeInt32(startingIndex++);
            donation.CreatedByName = reader.GetSafeString(startingIndex++);           
            donation.DateCreated = reader.GetSafeDateTime(startingIndex++);            

            return donation;
        }

        public DSummary MapSingleDonationSummary(IDataReader reader, ref int startingIndex)
        {
            DSummary donation = new DSummary();

            donation.CharitableFundId = reader.GetSafeInt32(startingIndex++);            
            donation.CharitableFundName = reader.GetSafeString(startingIndex++);           
            donation.TotalDonations = reader.GetSafeInt32(startingIndex++);
            donation.DateCreated = reader.GetSafeDateTime(startingIndex++);

            return donation;
        }

        #endregion



    }
}
