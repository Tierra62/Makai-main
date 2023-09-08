using Amazon.S3.Model;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain.SiteTrainings;
using Sabio.Models.Requests.SiteTrainings;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class SiteTrainingService : ISiteTrainingService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        ILookUpService _lookUpService = null;
        public SiteTrainingService(IDataProvider data, ILookUpService lookUpService, IBaseUserMapper userMapper)
        {
            _data = data;
            _lookUpService = lookUpService;
            _userMapper = userMapper;
        }

        public SiteTraining SelectById(int id)
        {
            string procName = "[dbo].[SiteTrainings_Select_ById]";

            SiteTraining siteTraining = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);
            },
            delegate (IDataReader reader, short set)
            {
                int index = 0;
                siteTraining = MapSingleSiteTraining(reader, ref index);
            }
            );
            return siteTraining;
        }
        public Paged<SiteTraining> Search(int pageIndex, int pageSize, string query, bool isDeleted)
        {
            Paged<SiteTraining> pagedList = null;
            List<SiteTraining> list = null;
            int totalCount = 0;

            string procName = "[dbo].[SiteTrainings_Search]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@Query", query);
                col.AddWithValue("@IsDeleted", isDeleted);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                SiteTraining siteTraining = MapSingleSiteTraining(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<SiteTraining>();
                }
                list.Add(siteTraining);
            });
            if (list != null)
            {
                pagedList = new Paged<SiteTraining>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public Paged<SiteTraining> SelectByCategoryId(int pageIndex, int pageSize, int categoryId, bool isDeleted)
        {
            Paged<SiteTraining> pagedList = null;
            List<SiteTraining> list = null;
            int totalCount = 0;

            string procName = "[dbo].[SiteTrainings_Select_ByCategoryId]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@CategoryId", categoryId);
                col.AddWithValue("@IsDeleted", isDeleted);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                SiteTraining siteTraining = MapSingleSiteTraining(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<SiteTraining>();
                }
                list.Add(siteTraining);
            }
             );
            if (list != null)
            {
                pagedList = new Paged<SiteTraining>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public Paged<SiteTraining> SelectByCreatedBy(int pageIndex, int pageSize, int userId, bool isDeleted)
        {
            Paged<SiteTraining> pagedList = null;
            List<SiteTraining> list = null;
            int totalCount = 0;

            string procName = "[dbo].[SiteTrainings_Select_ByCreatedBy]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@CreatedBy", userId);
                col.AddWithValue("@IsDeleted", isDeleted);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                SiteTraining siteTraining = MapSingleSiteTraining(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<SiteTraining>();
                }
                list.Add(siteTraining);
            }
             );
            if (list != null)
            {
                pagedList = new Paged<SiteTraining>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public Paged<SiteTraining> SelectAll(int pageIndex, int pageSize, bool isDeleted)
        {
            Paged<SiteTraining> pagedList = null;
            List<SiteTraining> list = null;
            int totalCount = 0;

            string procName = "[dbo].[SiteTrainings_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@IsDeleted", isDeleted);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                SiteTraining siteTraining = MapSingleSiteTraining(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<SiteTraining>(pageSize);
                }
                list.Add(siteTraining);
            }
            );
            if (list != null)
            {
                pagedList = new Paged<SiteTraining>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public int Add(SiteTrainingsAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[SiteTrainings_Insert]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);
                    col.AddWithValue("@CreatedBy", userId);
                    col.AddWithValue("@ModifiedBy", userId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;
                    Int32.TryParse(oId.ToString(), out id);
                });
            return id;
        }
        public void Update(SiteTrainingsUpdateRequest model, int userId)
        {
            string procName = "[dbo].[SiteTrainings_Update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);
                    col.AddWithValue("@ModifiedBy", userId);
                    col.AddWithValue("@Id", model.Id);
                },
                returnParameters: null);
        }
        public void Delete(int id)
        {
            string procName = "[dbo].[SiteTrainings_Delete_ById]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            }, returnParameters: null);
        }
        private SiteTraining MapSingleSiteTraining(IDataReader reader, ref int startingIndex)
        {
            SiteTraining aSiteTraining = new SiteTraining();

            aSiteTraining.Id = reader.GetSafeInt32(startingIndex++);
            aSiteTraining.Title = reader.GetString(startingIndex++);
            aSiteTraining.Description = reader.GetString(startingIndex++);
            aSiteTraining.CoverImageUrl = reader.GetString(startingIndex++);
            aSiteTraining.Category = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            aSiteTraining.CreatedBy = _userMapper.MapUser(reader, ref startingIndex);
            aSiteTraining.ModifiedBy = _userMapper.MapUser(reader, ref startingIndex);
            aSiteTraining.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aSiteTraining.DateModified = reader.GetSafeDateTime(startingIndex++);
            aSiteTraining.IsDeleted = reader.GetBoolean(startingIndex++);
            return aSiteTraining;
        }
        private static void AddCommonParams(SiteTrainingsAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Title", model.Title);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@CoverImageUrl", model.CoverImageUrl);
            col.AddWithValue("@CategoryId", model.CategoryId);
        }

    }
}
