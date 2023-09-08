using Sabio.Models;
using Sabio.Models.Domain.Advertisements;
using Sabio.Models.Requests.Advertisements;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IAdvertisementService
    {
        int Add(AdvertisementAddRequest model, int ownerId);
        void DeleteAdvertisement(int Id);
        Paged<Advertisement> GetAll(int pageIndex, int pageSize);
        Paged<Advertisement> GetByCreatedBy(int pageIndex, int pageSize, int ownerId);
        void UpdateAdvertisement(AdvertisementUpdateRequest model, int ownerId);
    }
}