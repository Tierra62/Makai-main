using Microsoft.AspNetCore.Mvc;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Blogs;
using Sabio.Models.Requests.Blogs;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Drawing.Printing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class BlogService : IBlogService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;

        public BlogService(IDataProvider data, IBaseUserMapper userMapper)
        {
            _data = data;
            _userMapper = userMapper;
        }

        public Paged<Blog> GetByCategory(int blogCategoryId, int pageIndex, int pageSize)
        {
            Paged<Blog> pagedList = null;
            List<Blog> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Blogs_Select_BlogCategory]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@BlogCategoryId", blogCategoryId);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Blog blog = MapSingleBlog(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<Blog>(pageSize);
                }
                list.Add(blog);
            }
           );
            if (list != null)
            {
                pagedList = new Paged<Blog>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Blog Get(int id)
        {
            Blog blog = null;

            string procName = "[dbo].[Blogs_SelectById]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
               blog = MapSingleBlog(reader, ref startingIndex);
            }
            );
            return blog;
        }

        public Paged<Blog> GetAll(int pageIndex, int pageSize)
        {
            Paged<Blog> pagedList = null;
            List<Blog> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Blogs_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);

            } , singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Blog blog = MapSingleBlog(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<Blog>(pageSize);
                }
                list.Add(blog);
            }
            );
            if(list != null)
            {
                pagedList = new Paged<Blog>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<Blog> Search(int pageIndex, int pageSize, string query)
        {
            Paged<Blog> pagedList = null;
            List<Blog> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Blogs_Search]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@Query", query);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Blog blog = MapSingleBlog(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<Blog>(pageSize);
                }
                list.Add(blog);
            }
            );
            if (list != null)
            {
                pagedList = new Paged<Blog>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<Blog> GetAllCreatedBy(int pageIndex, int pageSize, int authorId)
        {
            Paged<Blog> pagedList = null;
            List<Blog> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Blogs_Select_ByCreatedBy]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@AuthorId", authorId);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Blog blog = MapSingleBlog(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<Blog>();
                }
                list.Add(blog);
            }
            );
            if (list != null)
            {
                pagedList = new Paged<Blog>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public int Add(BlogAddRequest model, int authorId)
        {
            int id = 0;

            string procName = "[dbo].[Blogs_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@AuthorId", authorId);

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

        public void Delete(int id)
        {
            string procName = "[dbo].[Blogs_DeleteById]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {           
                col.AddWithValue("@Id", id);
            }, returnParameters: null);
        }

        public void Update(BlogUpdateRequest model, int authorId)
        {
            string procName = "[dbo].[Blogs_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@Id", model.Id);
                col.AddWithValue("@AuthorId", authorId);
                
            }, returnParameters: null);
        }

        private static void AddCommonParams(BlogAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@BlogCategoryId", model.BlogCategoryId);
            col.AddWithValue("@Title", model.Title);
            col.AddWithValue("@Subject", model.Subject);
            col.AddWithValue("@Content", model.Content);
            col.AddWithValue("@IsPublished", model.IsPublished);
            col.AddWithValue("@DatePublish", model.DatePublish);
            col.AddWithValue("@ImageUrl", model.ImageUrl);
        }

        public Blog MapSingleBlog(IDataReader reader, ref int startingIndex)
        {
            Blog blog = new Blog();
            blog.Id = reader.GetSafeInt32(startingIndex++);

            blog.CategoryType = new LookUp();
            blog.CategoryType.Id = reader.GetSafeInt32(startingIndex++);
            blog.CategoryType.Name = reader.GetSafeString(startingIndex++);
            blog.Author = _userMapper.MapUser(reader, ref startingIndex);
            blog.Title = reader.GetSafeString(startingIndex++);
            blog.Subject = reader.GetSafeString(startingIndex++);
            blog.Content = reader.GetSafeString(startingIndex++);
            blog.IsPublished = reader.GetSafeBool(startingIndex++);
            blog.ImageUrl = reader.GetSafeString(startingIndex++);
            blog.DateCreated = reader.GetSafeDateTime(startingIndex++);
            blog.DateModified = reader.GetSafeDateTime(startingIndex++);
            blog.DatePublish = reader.GetSafeDateTime(startingIndex++);
            blog.isDeleted = reader.GetBoolean(startingIndex++);
            return blog;

        }
    }
}
