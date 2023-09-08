using Sabio.Models;
using Sabio.Models.Domain.Blogs;
using Sabio.Models.Requests.Blogs;
using System.Collections.Generic;

namespace Sabio.Services
{
    public interface IBlogService
    {
        Paged<Blog> GetByCategory(int blogCategoryId, int pageIndex, int pageSize);
        Blog Get(int Id);
        Paged<Blog> GetAll(int pageIndex, int pageSize);
        Paged<Blog> Search(int pageIndex, int pageSize, string query);
        int Add(BlogAddRequest model, int authorId);
        void Update(BlogUpdateRequest model, int authorId);
        void Delete(int id);
        Paged<Blog> GetAllCreatedBy(int pageIndex, int pageSize, int authorId);
    }
}