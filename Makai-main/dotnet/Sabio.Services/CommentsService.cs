using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Comments;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Sabio.Services
{
    public class CommentsService : ICommentsService 
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;

        public CommentsService(IDataProvider data, IBaseUserMapper userMapper)
        {
            _data = data;
            _userMapper = userMapper;
        }

         public List<Comment> GetByEntityIdEntityType(int entityId, int entityTypeId)

        {
            string procName = "[dbo].[Comments_SelectByEntityId]";
            List<Comment> comments = null;

            _data.ExecuteCmd(procName,
                delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@EntityId", entityId); 
                    parameterCollection.AddWithValue("@EntityTypeId", entityTypeId);
                }
            , delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                 Comment comment = MapSingleComment(reader, ref startingIndex);
                if (comments == null)
                {
                    comments = new List<Comment>();
                }
                comments.Add(comment);

            });

            if (comments != null) 
            {
                GetReplies(comments);
            }

            return comments; 
        } 

        public Dictionary<int, List<Comment>> GetReplies (List<Comment> comments) 
        {
            Dictionary<int, Comment> sortedComments = new Dictionary<int, Comment>();
            List<Comment> outputList = new List<Comment>();
            foreach (Comment selectedComments in comments  )
            {
                Comment comment = selectedComments;
                if (comment.ParentId.HasValue)
                {
                    int parentId = comment.ParentId.Value;

                    if (sortedComments.ContainsKey(parentId))
                    {
                        sortedComments[parentId].Replies.Add(comment);
                    }
                    else
                    {
                        bool parentFound = false;
                        foreach (Comment c in comments)
                        {
                            if (c.Id == parentId)
                            {
                                c.Replies.Add(comment);
                                parentFound = true;
                                break;
                            }
                        }
                        if (!parentFound)
                        {
                            sortedComments.Add(parentId, new Comment { Id = parentId, Replies = new List<Comment> { comment } });
                        }
                    }
                }
                else
                {
                    sortedComments.Add(comment.Id, comment);
                }
            }
            return null;
        }

        public int Add(CommentsAddRequest model, int userId)  
        {
            string procName = "[dbo].[Comments_Insert]";
            int id = 0;
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);
                    col.AddWithValue("@EntityTypeId", model.EntityTypeId); 
                    col.AddWithValue("@CreatedBy", userId);
                    col.AddWithValue("@EntityId", model.EntityId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);
                }, returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;
                    int.TryParse(oId.ToString(), out id);
                }
            );

            return id;
        }

        public void Update(CommentsUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Comments_Update]";
            

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@Id", model.Id);
                col.AddWithValue("EntityTypeId", model.EntityTypeId);
                col.AddWithValue("@EntityId", model.EntityId);
            },
            returnParameters: null);
        }
        public void Delete(int id)
        {
            string procName = "[dbo].[Comments_DeleteById]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            });
        }

        private static void AddCommonParams(CommentsAddRequest model, SqlParameterCollection col) 
        {
            col.AddWithValue("@Subject", model.Subject);
            col.AddWithValue("@Text", model.Text);
            col.AddWithValue("@ParentId", model.ParentId);
        }
        
        public Comment MapSingleComment(IDataReader reader, ref int startingIndex) 
        {
            Comment aComment = new Comment();

            aComment.Id = reader.GetSafeInt32(startingIndex++);
            aComment.Subject = reader.GetSafeString(startingIndex++);
            aComment.Text = reader.GetSafeString(startingIndex++);
            aComment.ParentId = reader.GetSafeInt32(startingIndex++);
            aComment.EntityType = new LookUp();
            aComment.EntityType.Id = reader.GetSafeInt32(startingIndex++);
            aComment.EntityType.Name = reader.GetSafeString(startingIndex++);
            aComment.EntityId = reader.GetSafeInt32(startingIndex++);
            aComment.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aComment.DateModified = reader.GetSafeDateTime(startingIndex++);
            aComment.IsDeleted = reader.GetSafeBool(startingIndex++);
            aComment.Author = _userMapper.MapUser(reader, ref startingIndex);
            return aComment;
        }
    }
}
