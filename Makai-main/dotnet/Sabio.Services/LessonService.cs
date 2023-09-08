using Microsoft.AspNetCore.Mvc;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain.Lessons;
using Sabio.Models.Requests.Lessons;
using Sabio.Services.Interfaces;
using Sabio.Web.Models.Responses;
using sib_api_v3_sdk.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class LessonService : ILessonService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        ILookUpService _lookUpService;
        public LessonService(IDataProvider data, ILookUpService lookUpService, IBaseUserMapper userMapper)
        {
            _data = data;
            _userMapper = userMapper;
            _lookUpService = lookUpService;
        }

        public void Delete(int lessonId)
        {
            string procName = "[dbo].[Lessons_DeleteById]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", lessonId);
                },
                returnParameters: null);
        }


        public Paged<Lesson> GetAllPaginated(int pageIndex, int pageSize)
        {
            Paged<Lesson> pagedList = null;
            List<Lesson> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                "dbo.Lessons_SelectAll",
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    Lesson lesson = MapSingleLesson(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }

                    if (list == null)
                    {
                        list = new List<Lesson>();
                    }
                    list.Add(lesson);
                });
            if (list != null)
            {
                pagedList = new Paged<Lesson>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }

        public Lesson GetById(int id)
        {
            string procName = "[dbo].[Lessons_Select_ById]";

            Lesson lesson = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                lesson = MapSingleLesson(reader, ref startingIndex);
                
                
            });

            return lesson;
        }

        public Paged<Lesson> GetBySiteIdPaginated(int pageSize, int pageIndex, int siteId)
        {
            Paged<Lesson> pagedList = null;
            List<Lesson> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                "dbo.Lessons_Select_BySiteTrainingId",
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@SiteTrainingId", siteId);
                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    Lesson lesson = MapSingleLesson(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex);
                    }

                    if (list == null)
                    {
                        list = new List<Lesson>();
                    }
                    list.Add(lesson);
                });
            if (list != null)
            {
                pagedList = new Paged<Lesson>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;    
                
        }

        public int Add(LessonAddRequest model, int userId) 
        {
            int id = 0;

            string procName = "[dbo].[Lessons_Insert]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col, userId);
                    col.AddWithValue("@CreatedBy", userId);
                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;
                    col.Add(idOut);
                },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
                Console.WriteLine("");
            });
        return id;

        }

        public void Update(LessonUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Lessons_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection parameterCollection)
            {

                AddCommonParams(model, parameterCollection, userId);
                parameterCollection.AddWithValue("@Id", model.Id);
                parameterCollection.AddWithValue("@ModifiedBy", userId);

             
            },
            returnParameters: null);
        }


        private static void AddCommonParams(LessonAddRequest model, SqlParameterCollection col, int userId)

           
        {
            col.AddWithValue("@SiteTrainingId", model.SiteTrainingId);
            col.AddWithValue("@Title", model.Title);
            col.AddWithValue("@Subject", model.Subject);
            col.AddWithValue("@Summary", model.Summary);
            col.AddWithValue("@Duration", model.Duration);     
            col.AddWithValue("@CoverImageUrl", model.CoverImageUrl);
            col.AddWithValue("@LessonTypeId", model.LessonTypeId);
      
            col.AddWithValue("@MediaUrl", model.MediaUrl);
           

        }

        private Lesson MapSingleLesson(IDataReader reader, ref int startingIndex)
        {
            Lesson aLesson = new Lesson();

            aLesson.Id = reader.GetSafeInt32(startingIndex++);
            aLesson.SiteTrainingId = reader.GetSafeInt32(startingIndex++);
            aLesson.Title = reader.GetSafeString(startingIndex++);
            aLesson.Subject = reader.GetSafeString(startingIndex++);
            aLesson.Summary = reader.GetSafeString(startingIndex++);
            aLesson.Duration = reader.GetSafeString(startingIndex++);
            aLesson.CoverImageUrl = reader.GetSafeString(startingIndex++);
            aLesson.LessonTypeId = reader.GetSafeInt32(startingIndex++);
            aLesson.CreatedBy = _userMapper.MapUser(reader, ref startingIndex);
            aLesson.ModifiedBy = _userMapper.MapUser(reader, ref startingIndex);
            aLesson.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aLesson.DateModified = reader.GetSafeDateTime(startingIndex++);
            aLesson.MediaUrl = reader.GetSafeString(startingIndex++); 

            return aLesson;
        }

    }
}
