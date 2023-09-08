using Microsoft.AspNetCore.Http;
using Sabio.Models;
using Sabio.Models.Requests.Files;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IFileService
    {
        int Add(FileAddRequest model, int userId);
        void DeleteById(int deleteId);
        void RecoverById(int recoverId);
        File MapSingleFile(IDataReader reader, ref int startingIndex);
        Paged<File> GetByFileType(FileSelectByTypesRequest fileModel);
        Paged<File> GetAll(int pageIndex, int pageSize);
        Paged<File> GetByCreatedBy(int pageIndex, int pageSize, int id);
        Paged<File> GetByQuery(int pageIndex, int pageSize, string query);
        Paged<File> GetByDeleted(int pageIndex, int pageSize, bool isDeleted);
        List<AWSFileAddRequest> UploadFile(IFormFile[] files, int userId);
    }
}