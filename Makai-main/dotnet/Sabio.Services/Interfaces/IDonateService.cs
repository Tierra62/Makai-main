using Sabio.Models;
using Sabio.Models.Domain.CharitableFunds;
using Sabio.Models.Domain.Donations;
using Sabio.Models.Requests.CharitableFunds;
using System.Collections.Generic;
using System;
using Sabio.Models.Requests.Donations;

namespace Sabio.Services.Interfaces
{
    public interface IDonateService
    {
        CharitableFund GetCharitableFund(int id);
        Paged<CharitableFund> GetAllCharitableFund(int pageIndex, int pageSize);
        CharitableFund GetByCreatorCharitableFund(int id);
        int AddCharitableFund(CharitableFundAddRequest model, int createdBy);
        void DeleteCharitableFund(int id);
        void UpdateCharitableFund(CharitableFundUpdateRequest request);
        List<Donation> GetByCharityIdDonation(int id);
        List<Donation> GetByCreatorDonation(int id);
        List<DSummary> GetSummaryDonation(DateTime dateStart, DateTime dateEnd);
        int AddDonation(DonationAddRequest model, int createdBy);
    }
}