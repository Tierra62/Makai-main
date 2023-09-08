using Amazon;
using Amazon.S3;
using Amazon.S3.Transfer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.AppSettings;
using Sabio.Models.Domain;
using Sabio.Models.Enums;
using Sabio.Models.Requests.Files;
using Sabio.Services.Interfaces;
using Stripe;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class FileService : IFileService
    {

        private IDataProvider _data = null;
        private AWSStorageConfig _awsConfig;

        private static IAmazonS3 s3Client;

        public FileService(IDataProvider data, IOptions<AWSStorageConfig> awsConfig)
        {
            _data = data;
            _awsConfig = awsConfig.Value;
        }

        private int GetFileTypeByExt(string fileName)
        {
            if (fileName == null)
            {
                return (int)FileType.Other;
            }
            string[] parts = fileName.Split(".");
            string ext = parts[1];
            string extUpper = ext.ToUpper();
            FileType fileType = 0;

            switch (extUpper)
            {
                case "PDF":
                    fileType = FileType.PDF;
                    break;
                case "DOC":
                    fileType = FileType.DOC;
                    break;
                case "DOCX":
                    fileType = FileType.DOCX;
                    break;
                case "xls":
                    fileType = FileType.XLS;
                    break;
                case "TXT":
                    fileType = FileType.TXT;
                    break;
                case "TIFF":
                    fileType = FileType.Tiff;
                    break;
                case "JPEG":
                    fileType = FileType.JPG;
                    break;
                case "JPG":
                    fileType = FileType.JPG;
                    break;
                case "PNG":
                    fileType = FileType.PNG;
                    break;
                case "MP4":
                    fileType = FileType.MP4;
                    break;
                case "GIF":
                    fileType = FileType.GIF;
                    break;
                case "ZIP":
                    fileType = FileType.ZIP;
                    break;
                case "WAV":
                    fileType = FileType.WAV;
                    break;
                case "WMV":
                    fileType = FileType.WMV;
                    break;
                case "MP3":
                    fileType = FileType.MP3;
                    break;
                case "XML":
                    fileType = FileType.XML;
                    break;
                case "SVG":
                    fileType = FileType.SVG;
                    break;
                case "EXE":
                    fileType = FileType.EXE;
                    break;
                case "RAR":
                    fileType = FileType.RAR;
                    break;
                case "BMP":
                    fileType = FileType.BMP;
                    break;
                case "HTML":
                    fileType = FileType.HTML;
                    break;
                case "SWF":
                    fileType = FileType.SWF;
                    break;
                default:
                    fileType = FileType.Other;
                    break;
            }
            return (int)fileType;
        }

        public void DeleteById(int deleteId)
        {
            string procName = "[dbo].[Files_DeleteById]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@Id", deleteId);
                }, null);
        }

        public void RecoverById(int recoverId)
        {
            string procName = "[dbo].[Files_RecoverById]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@Id", recoverId);
                }, null);
        }

        public Paged<File> GetByFileType(FileSelectByTypesRequest fileModel)
        {
            Paged<File> pagedList = null;
            List<File> fileList = null;
            DataTable fileDataTable = null;

            int totalCount = 0;

            string procName = "[dbo].[Files_SelectByMultipleFileTypes]";

            if (fileModel.FileTypes != null)
            {
                fileDataTable = MapFileTypesToTable(fileModel.FileTypes);
            }

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@PageIndex", fileModel.PageIndex);
                    collection.AddWithValue("@PageSize", fileModel.PageSize);
                    collection.AddWithValue("@BatchFileTypes", fileDataTable);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    File aFile = MapSingleFile(reader, ref startingIndex);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex++);
                    }
                    if (fileList == null)
                    {
                        fileList = new List<File>();
                    }
                    fileList.Add(aFile);
                });

            if (fileList != null)
            {
                pagedList = new Paged<File>(fileList, fileModel.PageIndex, fileModel.PageSize, totalCount);
            }

            return pagedList;

        }
        public Paged<File> GetByDeleted(int pageIndex, int pageSize, bool isDeleted)
        {
            Paged<File> pagedList = null;
            List<File> fileList = null;
            int totalCount = 0;

            string procName = "[dbo].[Files_SelectByDeleted]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@PageIndex", pageIndex);
                    collection.AddWithValue("@PageSize", pageSize);
                    collection.AddWithValue("@isDeleted", isDeleted);
                },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                File aFile = MapSingleFile(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (fileList == null)
                {
                    fileList = new List<File>();
                }
                fileList.Add(aFile);
            });

            if (fileList != null)
            {
                pagedList = new Paged<File>(fileList, pageIndex, pageSize, totalCount);

            }

            return pagedList;

        }

        public Paged<File> GetByCreatedBy(int pageIndex, int pageSize, int id)
        {
            Paged<File> pagedList = null;
            List<File> fileList = null;
            int totalCount = 0;

            string procName = "[dbo].[Files_Select_ByCreatedBy]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@PageIndex", pageIndex);
                collection.AddWithValue("@PageSize", pageSize);
                collection.AddWithValue("@Id", id);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                File aFile = MapSingleFile(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (fileList == null)
                {
                    fileList = new List<File>();
                }
                fileList.Add(aFile);
            });

            if (fileList != null)
            {
                pagedList = new Paged<File>(fileList, pageIndex, pageSize, totalCount);

            }

            return pagedList;
        }

        public Paged<File> GetAll(int pageIndex, int pageSize)
        {
            Paged<File> pagedList = null;
            List<File> fileList = null;
            int totalCount = 0;

            string procName = "[dbo].[Files_SelectAll]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@PageIndex", pageIndex);
                    collection.AddWithValue("@PageSize", pageSize);
                },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                File aFile = MapSingleFile(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (fileList == null)
                {
                    fileList = new List<File>();
                }
                fileList.Add(aFile);
            });

            if (fileList != null)
            {
                pagedList = new Paged<File>(fileList, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public Paged<File> GetByQuery(int pageIndex, int pageSize, string query)
        {
            Paged<File> pagedList = null;
            List<File> fileList = null;
            int totalCount = 0;

            string procName = "[dbo].[Files_Search_ByQuery]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@PageIndex", pageIndex);
                    collection.AddWithValue("@PageSize", pageSize);
                    collection.AddWithValue("@Query", query);
                },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                File aFile = MapSingleFile(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (fileList == null)
                {
                    fileList = new List<File>();
                }
                fileList.Add(aFile);
            });

            if (fileList != null)
            {
                pagedList = new Paged<File>(fileList, pageIndex, pageSize, totalCount);

            }

            return pagedList;
        }

        public int Add(FileAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[Files_Insert]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@Name", model.Name);
                    collection.AddWithValue("@Url", model.Url);
                    collection.AddWithValue("@CreatedBy", userId);
                    collection.AddWithValue("@FileTypeId", GetFileTypeByExt(model.Name));
                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;
                    collection.Add(idOut);
                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;
                    int.TryParse(oId.ToString(), out id);
                });
            return id;
        }

        public List<AWSFileAddRequest> Add(int userId, List<FileAddRequest> fileList)
        {

            string procName = "[dbo].[Files_Insert_Batch]";
            DataTable fileDataTable = MapFilesToTable(fileList);
            List<AWSFileAddRequest> filesOut = null;

            if (fileList != null)
            {
                _data.ExecuteCmd(
                    procName,
                    inputParamMapper: delegate (SqlParameterCollection collection)
                    {
                        collection.AddWithValue("@BatchFiles", fileDataTable);
                        collection.AddWithValue("@CreatedBy", userId);
                    },
                    singleRecordMapper: delegate (IDataReader reader, short set)
                    {
                        int index = 0;
                        AWSFileAddRequest uploadedFile = new AWSFileAddRequest();
                        uploadedFile.Id = reader.GetSafeInt32(index++);
                        uploadedFile.Url = reader.GetSafeString(index++);

                        if (filesOut == null)
                        {
                            filesOut = new List<AWSFileAddRequest>();
                        }

                        filesOut.Add(uploadedFile);
                    }
                );
            }
            return filesOut;
        }

        public AWSFileAddRequest Add(int userId, string fileUrl, IFormFile file)
        {
            int id = 0;
            string procName = "[dbo].[Files_Insert]";
            AWSFileAddRequest uploadedFile = new AWSFileAddRequest();

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection collection)
                {
                    collection.AddWithValue("@Name", file.FileName);
                    collection.AddWithValue("@Url", fileUrl);
                    collection.AddWithValue("@CreatedBy", userId);
                    collection.AddWithValue("@FileTypeId", GetFileTypeByExt(file.FileName));
                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;
                    collection.Add(idOut);
                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;
                    int.TryParse(oId.ToString(), out id);
                });

            uploadedFile.Url = fileUrl;
            uploadedFile.Id = id;
            return uploadedFile;
        }

        public List<AWSFileAddRequest> UploadFile(IFormFile[] files, int userId)
        {
            List<AWSFileAddRequest> insertList = null;
            List<FileAddRequest> uploadedFilesList = null;
            string bucketName = _awsConfig.BucketName;
            RegionEndpoint bucketRegion = RegionEndpoint.USWest2;
            s3Client = new AmazonS3Client(_awsConfig.AccessKey, _awsConfig.Secret, bucketRegion);
            var fileTransferUtility = new TransferUtility(s3Client);

            for (int i = 0; i < files.Length; i++)
            {
                string keyName = $"{Guid.NewGuid()}/{files[i].FileName.Replace(" ", string.Empty)}";
                string url = _awsConfig.Domain + $"{keyName}";

                var fileTransferUtilityRequest = new TransferUtilityUploadRequest
                {
                    BucketName = bucketName,
                    Key = keyName,
                    InputStream = files[i].OpenReadStream(),
                };

                fileTransferUtility.Upload(fileTransferUtilityRequest);
                FileAddRequest uploadedFile = new FileAddRequest()
                {
                    Url = url,
                    FileType = GetFileTypeByExt(files[i].FileName),
                    Name = files[i].FileName

                };
                if (uploadedFilesList == null)
                {
                    uploadedFilesList = new List<FileAddRequest>();
                }

                uploadedFilesList.Add(uploadedFile);
            }
            insertList = Add(userId, uploadedFilesList);

            return insertList;
        }

        public File MapSingleFile(IDataReader reader, ref int startingIndex)
        {
            File aFile = new File();
            aFile.FileType = new LookUp();

            aFile.Id = reader.GetSafeInt32(startingIndex++);
            aFile.Name = reader.GetSafeString(startingIndex++);
            aFile.Url = reader.GetSafeString(startingIndex++);
            aFile.IsDeleted = reader.GetBoolean(startingIndex++);
            aFile.CreatedBy = reader.GetSafeInt32(startingIndex++);
            aFile.FirstName = reader.GetSafeString(startingIndex++);
            aFile.LastName = reader.GetSafeString(startingIndex++);
            aFile.DateCreated = reader.GetDateTime(startingIndex++);
            aFile.FileType.Id = reader.GetSafeInt32(startingIndex++);
            aFile.FileType.Name = reader.GetSafeString(startingIndex++);
            return aFile;
        }

        private DataTable MapFilesToTable(List<FileAddRequest> files)
        {
            DataTable dt = new DataTable();
            if (files != null)
            {
                dt.Columns.Add(new DataColumn("Name", typeof(string)));
                dt.Columns.Add(new DataColumn("Url", typeof(string)));
                dt.Columns.Add(new DataColumn("FileTypeId", typeof(int)));

                for (int i = 0; i < files.Count; i++)
                {
                    DataRow dr = dt.NewRow();
                    int startingIndex = 0;
                    dr.SetField(startingIndex++, files[i].Name);
                    dr.SetField(startingIndex++, files[i].Url);
                    dr.SetField(startingIndex++, files[i].FileType);
                    dt.Rows.Add(dr);
                }
            }
            return dt;
        }

        private DataTable MapFileTypesToTable(List<int> fileTypes)
        {
            DataTable dt = new DataTable();

            if (fileTypes != null)
            {
                dt.Columns.Add(new DataColumn("FileTypes", typeof(int)));
                for (int i = 0; i < fileTypes.Count; i++)
                {
                    DataRow dr = dt.NewRow();
                    int startingIndex = 0;
                    dr.SetField(startingIndex++, fileTypes[i]);
                    dt.Rows.Add(dr);
                }
            }
            return dt;
        }
    }
}

