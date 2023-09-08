using Sabio.Data.Providers;
using Sabio.Services.Interfaces;
using Sabio.Models.Requests;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Sabio.Models.Domain.ShareStory;
using Sabio.Models.Domain;
using Sabio.Data;
using Sabio.Models;
using Sabio.Models.Requests.ShareStory;

namespace Sabio.Services
{
    public class ShareStoryService : IShareStoryService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;

        public ShareStoryService(IDataProvider data, IBaseUserMapper userMapper)
        {
            _data = data;
            _userMapper = userMapper;
        }

        public int Add(ShareStoryAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[ShareStory_InsertV2]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                AddCommonParams(model, collection);
                collection.AddWithValue("@CreatedBy", userId);
                collection.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection ReturnCollection)
            {
                object objId = ReturnCollection["@Id"].Value;

                int.TryParse(objId.ToString(), out id);
            });

            return id;
        }

        public ShareStory Get(int id)
        {
            ShareStory story = null;

            string procName = "[dbo].[ShareStory_Select_ByIdV2]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                story = MapSingleStory(reader, ref startingIndex);
            }
            );

            return story;
        }

        public Paged<ShareStory> GetAll(int pageIndex, int pageSize)
        {
            Paged<ShareStory> pagedResult = null;
            List<ShareStory> result = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                "[dbo].[ShareStory_SelectAllV2]",
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {

                    ShareStory model = null;
                    int index = 0;
                    model = MapSingleStory(reader, ref index);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }


                    if (result == null)
                    {
                        result = new List<ShareStory>();
                    }

                    result.Add(model);
                });

            if (result != null)
            {
                pagedResult = new Paged<ShareStory>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public void Update(ShareStoryUpdateRequest model, int userId)
        {
            string procName = "[dbo].[ShareStory_UpdateV2]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection parameterCollection)
            {
                AddCommonParams(model, parameterCollection);
                parameterCollection.AddWithValue("@Id", model.Id);
                parameterCollection.AddWithValue("@CreatedBy", userId);
            },
            returnParameters: null);
        }

        public void UpdateApproval(int id, int userId)
        {
            string procName = "[dbo].[ShareStory_Update_Approval]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection parameterCollection)
            {
                
                parameterCollection.AddWithValue("@Id", id);
                parameterCollection.AddWithValue("@ApprovedBy", userId);
            },
            returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[ShareStory_Delete_ById]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", id);

            }, returnParameters: null);
        }


        private static void AddCommonParams(ShareStoryAddRequest model, SqlParameterCollection paramCollection)
        {
            paramCollection.AddWithValue("@Name", model.Name);
            paramCollection.AddWithValue("@Email", model.Email);
            paramCollection.AddWithValue("@Story", model.Story);
            paramCollection.AddWithValue("@FileId", model.FileId);

        }

        public ShareStory MapSingleStory(IDataReader reader, ref int startingIndex)
        {
           

            ShareStory model = new ShareStory();

            model.Id = reader.GetSafeInt32(startingIndex++);
            model.Name = reader.GetSafeString(startingIndex++);
            model.Email = reader.GetSafeString(startingIndex++);
            model.Story = reader.GetSafeString(startingIndex++);
            model.CreatedBy = _userMapper.MapUser(reader, ref startingIndex);
            model.IsApproved = reader.GetSafeBool(startingIndex++);
            model.ApprovedBy = reader.GetSafeInt32(startingIndex++);
            model.Files = reader.DeserializeObject<List<ShareStoryFile>>(startingIndex++);
            model.DateCreated = reader.GetSafeDateTime(startingIndex++);
            model.DateModified = reader.GetSafeDateTime(startingIndex++);

            return model;
        }

    }
    
}
