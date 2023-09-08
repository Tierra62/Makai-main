using Sabio.Data.Providers;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Requests.SiteReferences;
using Sabio.Data;
using Sabio.Models.Domain.SiteReferences;
using Sabio.Models;
using Sabio.Models.Domain;

namespace Sabio.Services
{
    public class SiteReferenceService : ISiteReferenceService
    {
        IDataProvider _data = null;
        public SiteReferenceService(IDataProvider data)
        {
            _data = data;
        }

        public int Add(SiteReferenceAddRequest model)
        {
            int id = 0;

            string procName = "[dbo].[SiteReference_Insert]";
            _data.ExecuteNonQuery(procName,
            inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@UserId", model.UserId);
                col.AddWithValue("@SiteReferenceId", model.SiteReferenceId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);
            },

            returnParameters: delegate (SqlParameterCollection returnCollection)

            {
                object oId = returnCollection["@Id"].Value;

                int.TryParse(oId.ToString(), out id);
            });

            return id;

        }
        public Paged<SiteReference> GetPaginated(int pageIndex, int pageSize)
        {
            Paged<SiteReference> pagedList = null;
            List<SiteReference> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                "dbo.SiteReference_SelectAll_Paginated",
                (param) =>
                {
                    param.AddWithValue("@PageIndex", pageIndex);
                    param.AddWithValue("@PageSize", pageSize);
                },
                (reader, recordSetIndex) =>
                {
                    int startingIndex = 0;
                    SiteReference sitereference = MapSingleSiteReference(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }
                   
                    if (list == null)
                    {
                        list = new List<SiteReference>();
                    }

                    list.Add(sitereference);
                });

                    if (list != null)
                    {
                        pagedList = new Paged<SiteReference>(list, pageIndex, pageSize, totalCount);
                    }
                    return pagedList;
                }

        public List<SiteReferenceChart> GetAllChart()
        {
            string procName = "[dbo].[SiteReference_SelectAll]";

            List<SiteReferenceChart> list = null;

            _data.ExecuteCmd(procName, inputParamMapper: null,
           singleRecordMapper: delegate (IDataReader reader, short set)
           {
               SiteReferenceChart siteReference = MapSingleSiteReferenceChart(reader);

               if (list == null)
               {
                   list = new List<SiteReferenceChart>();
               }

               list.Add(siteReference);
           }
           );
            return list;
        }
        private static SiteReference MapSingleSiteReference(IDataReader reader, ref int startingIndex)
        {
           SiteReference siteReference = new SiteReference();
            siteReference.Type = new LookUp();
            siteReference.Type.Id = reader.GetSafeInt32(startingIndex++);
            siteReference.Type.Name = reader.GetSafeString(startingIndex++);
            siteReference.UserId = reader.GetSafeInt32(startingIndex++);

            return siteReference;
        }

        private static SiteReferenceChart MapSingleSiteReferenceChart(IDataReader reader)
        {
            SiteReferenceChart siteReference = new SiteReferenceChart();
            int startingIndex = 0;
            siteReference.Name = reader.GetSafeString(startingIndex++);
            siteReference.TotalCount = reader.GetSafeInt32(startingIndex++);

            return siteReference;
        }
    }
}
