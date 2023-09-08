using Sabio.Data.Providers;
using Stripe;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Data;
using Sabio.Models;
using Sabio.Models.Domain.Podcasts;
using Sabio.Models.Requests.Podcasts;
using Sabio.Services.Interfaces;
using Sabio.Models.Domain;


namespace Sabio.Services
{
    public class PodcastService : IPodcastService
    {

        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        public PodcastService(IDataProvider data, IBaseUserMapper userMapper)
        {
            _data = data;
            _userMapper = userMapper;   
        }

        //public methods
        public int Add(PodcastAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[Podcasts_Insert]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection coll)
                {

                    AddCommonParams(model, coll);
                    coll.AddWithValue("@CreatedBy", userId);

                    //output parameter
                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;
                    coll.Add(idOut);

                },
                returnParameters: delegate (SqlParameterCollection returnColl)
                {
                    object oId = returnColl[0].Value;
                    Int32.TryParse(oId.ToString(), out id);
                });

            return id;

        }
        public void Update(PodcastUpdateRequest model, int userId)
        {

            string procName = "[dbo].[Podcasts_update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection coll)
                {

                    AddCommonParams(model, coll);
                    coll.AddWithValue("@ModifiedBy", userId);
                    coll.AddWithValue("@Id", model.Id);

                },
                returnParameters: null);

        }
        public void Delete(int id)
        {

            string procName = "[dbo].[Podcasts_Delete_ById]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@Id", id);

                }, returnParameters: null);

        }
        public Paged<Podcast> Pagination(int page, int pageSize)
        {
            Paged<Podcast> pagedList = null;
            List<Podcast> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Podcasts_SelectAll]";

            _data.ExecuteCmd(procName,
                (param) =>
                {
                    param.AddWithValue("@PageIndex", page);
                    param.AddWithValue("@PageSize", pageSize);


                }, (reader, recordSetIndex) =>
                {
                    int index = 0;

                    Podcast pod = MapPodcast(reader, ref index);

                    totalCount = reader.GetSafeInt32(index);

                    if (list == null)
                    {
                        list = new List<Podcast>();
                    }
                    list.Add(pod);
                });

            if (list != null)
            {
                pagedList = new Paged<Podcast>(list, page, pageSize, totalCount);
            }



            return pagedList;
        }
        public Paged<Podcast> SearchPagination(int page, int pageSize, string query)
        {
            Paged<Podcast> pagedList = null;
            List<Podcast> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Podcasts_Search_Paginated]";

            _data.ExecuteCmd(procName,
                (param) =>
                {
                    param.AddWithValue("@PageIndex", page);
                    param.AddWithValue("@PageSize", pageSize);
                    param.AddWithValue("@Query", query);


                }, (reader, recordSetIndex) =>
                {
                    int index = 0;
                    Podcast friend = MapPodcast(reader, ref index);

                    totalCount = reader.GetSafeInt32(index);

                    if (list == null)
                    {
                        list = new List<Podcast>();
                    }
                    list.Add(friend);
                });

            if (list != null)
            {
                pagedList = new Paged<Podcast>(list, page, pageSize, totalCount);
            }



            return pagedList;
        }


        //private methods
        private static void AddCommonParams(PodcastAddRequest model, SqlParameterCollection coll)
        {
            coll.AddWithValue("@Title", model.Title);
            coll.AddWithValue("@Description", model.Description);
            coll.AddWithValue("@Url", model.Url);
            coll.AddWithValue("@PodcastTypeId", model.PodcastTypeId);
            coll.AddWithValue("@CoverImageUrl", model.CoverImageUrl);
        }
        public Podcast MapPodcast(IDataReader reader, ref int index)
        {
            Podcast podcast = new Podcast();

            podcast.Id = reader.GetSafeInt32(index++);
            podcast.Title = reader.GetSafeString(index++);
            podcast.Description = reader.GetSafeString(index++);
            podcast.Url = reader.GetSafeString(index++);

            podcast.PodcastType = new LookUp();
            podcast.PodcastType.Id = reader.GetSafeInt32(index++);
            podcast.PodcastType.Name = reader.GetSafeString(index++);

            podcast.CoverImageUrl = reader.GetSafeString(index++);
            podcast.DateCreated = reader.GetSafeDateTime(index++);
            podcast.DateModified = reader.GetSafeDateTime(index++);
            podcast.CreatedBy = _userMapper.MapUser(reader, ref index);
            podcast.ModifiedBy = _userMapper.MapUser(reader, ref index);

            return podcast;
        }

       
    }
}
