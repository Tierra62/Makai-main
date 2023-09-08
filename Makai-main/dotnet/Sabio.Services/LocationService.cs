using Sabio.Data.Providers;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Domain.Locations;
using Sabio.Data;
using Sabio.Services.Interfaces;
using Sabio.Models;
using Sabio.Models.Requests.Locations;
using static System.Net.Mime.MediaTypeNames;
using System.Reflection;
using Sabio.Models.Domain;

namespace Sabio.Services
{
    public class LocationService : ILocationService
    {
        IDataProvider _data = null;

        public LocationService(IDataProvider data)
        {
            _data = data;
        }

        public List<Location> GetByLocationType(int locationTypeId)
        {
            string procName = "[dbo].[Locations_SelectByLocationType]";

            List<Location> locationList = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@LocationTypeId", locationTypeId);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Location location = MapSingleLocation(reader, ref startingIndex);

                if (locationList == null)
                {
                    locationList = new List<Location>();
                }
                locationList.Add(location);
            }
            );
            return locationList;
        }

        public Paged<Location> GetByCreatedBy(int pageIndex, int pageSize, int createdBy)
        {
            Paged<Location> pagedLocation = null;
            List<Location> locationList = null;
            int totalCount = 0;
            string procName = "[dbo].[Locations_SelectByCreatedBy_Paginated]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@CreatedBy", createdBy);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Location location = MapSingleLocation(reader, ref startingIndex);
                totalCount = reader.GetSafeInt32(startingIndex++);

                if (locationList == null)
                {
                    locationList = new List<Location>();
                }
                locationList.Add(location);
            }
            );
            if (locationList != null)
            {
                pagedLocation = new Paged<Location>(locationList, pageIndex, pageSize, totalCount);
            }
            return pagedLocation;
        }

        public int Add(LocationAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Locations_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection parameterCollection)
            {
                AddCommonParams(model, parameterCollection);
                parameterCollection.AddWithValue("@UserId", userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                parameterCollection.Add(idOut);
            },
            returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object objectId = returnCollection["@Id"].Value;

                int.TryParse(objectId.ToString(), out id);
            });
            return id;
        }

        public void Update(LocationUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Locations_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection parameterCollection)
            {
                AddCommonParams(model, parameterCollection);
                parameterCollection.AddWithValue("@Id", model.Id);
                parameterCollection.AddWithValue("@ModifiedBy", userId);
            },
            returnParameters: null);
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Locations_Delete]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Id", id);
            },
             returnParameters: null);
        }

        public Location MapSingleLocation(IDataReader reader, ref int startingIndex)
        {
            Location location = new Location();
            LookUp locationType = new LookUp();
            LookUp3Col state = new LookUp3Col();
            location.LocationType = locationType;
            location.State = state;

            location.Id = reader.GetSafeInt32(startingIndex++);
            locationType.Id = reader.GetSafeInt32(startingIndex++);
            locationType.Name = reader.GetString(startingIndex++);
            location.LineOne = reader.GetSafeString(startingIndex++);
            location.LineTwo = reader.GetSafeString(startingIndex++);
            location.City = reader.GetSafeString(startingIndex++);
            location.Zip = reader.GetSafeString(startingIndex++);
            state.Id = reader.GetSafeInt32(startingIndex++);
            state.Name = reader.GetString(startingIndex++);
            state.Col3 = reader.GetSafeString(startingIndex++);
            location.Latitude = reader.GetSafeDouble(startingIndex++);
            location.Longitude = reader.GetSafeDouble(startingIndex++);
            location.IsDeleted = reader.GetSafeBool(startingIndex++);

            return location;
        }

        private static void AddCommonParams(LocationAddRequest model, SqlParameterCollection parameterCollection)
        {
            parameterCollection.AddWithValue("@LocationTypeId", model.LocationTypeId);
            parameterCollection.AddWithValue("@LineOne", model.LineOne);
            parameterCollection.AddWithValue("@LineTwo", model.LineTwo);
            parameterCollection.AddWithValue("@City", model.City);
            parameterCollection.AddWithValue("@Zip", model.Zip);
            parameterCollection.AddWithValue("@StateId", model.StateId);
            parameterCollection.AddWithValue("@Latitude", model.Latitude);
            parameterCollection.AddWithValue("@Longitude", model.Longitude);
        }
    }
}
