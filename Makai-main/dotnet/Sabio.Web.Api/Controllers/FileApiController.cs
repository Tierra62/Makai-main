using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Build.Framework;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Requests.Files;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using SendGrid;
using System;
using System.Collections;
using System.Collections.Generic;
using static Google.Apis.Requests.BatchRequest;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/files")]
    [ApiController]
    public class FileApiController : BaseApiController
    {
        private IFileService _service = null;
        private IAuthenticationService<int> _authService = null;


        public FileApiController(IFileService fileService, ILogger<FileApiController> logger, IAuthenticationService<int> authService)
        : base(logger)
        {
            _service = fileService;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Add(FileAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }

            return result;
        }

        [HttpPost("upload")]
        public ActionResult<ItemsResponse<AWSFileAddRequest>> Upload(IFormFile[] files)
        {
            ObjectResult result = null;
            int code = 201;

            try
            {
                int userId = _authService.GetCurrentUserId();
                List<AWSFileAddRequest> uploadedFiles = _service.UploadFile(files, userId);

                ItemsResponse<AWSFileAddRequest> response = new ItemsResponse<AWSFileAddRequest> { Items = uploadedFiles };
                result = StatusCode(code, response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpGet]
        public ActionResult<ItemResponse<Paged<File>>> GetPaginated(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<File> page = _service.GetAll(pageIndex, pageSize);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("paged list of files not found");
                }
                else
                {
                    response = new ItemResponse<Paged<File>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());

            }
            return (StatusCode(code, response));
        }

        [HttpGet("createdby")]
        public ActionResult<ItemsResponse<Paged<File>>> GetPaginatedByCreated(int pageIndex, int pageSize, int createdId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<File> page = _service.GetByCreatedBy(pageIndex, pageSize, createdId);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("search for paged list of files not found");
                }
                else
                {
                    response = new ItemResponse<Paged<File>> { Item = page };
                }
            }
            catch (Exception ex)
            {

                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return (StatusCode(code, response));
        }

        [HttpPost("filetype")]
        public ActionResult<ItemResponse<Paged<File>>> GetPaginatedByFileType(FileSelectByTypesRequest fileModel)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<File> pagedFilesByType = _service.GetByFileType(fileModel);

                if (pagedFilesByType == null)
                {
                    code = 404;
                    response = new ErrorResponse("paged list of files by type not found");
                }
                else
                {
                    response = new ItemResponse<Paged<File>> { Item = pagedFilesByType };
                }

            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }


        [HttpGet("query")]
        public ActionResult<ItemResponse<Paged<File>>> GetPaginatedByQuery(int pageIndex, int pageSize, string query)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<File> page = _service.GetByQuery(pageIndex, pageSize, query);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("search for paged list of files by query not found");
                }
                else
                {
                    response = new ItemResponse<Paged<File>> { Item = page };
                }
            }
            catch (Exception ex)
            {

                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("deleted")]
        public ActionResult<ItemResponse<Paged<File>>> GetPaginatedByDeleted(int pageIndex, int pageSize, bool isDeleted)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<File> page = _service.GetByDeleted(pageIndex, pageSize, isDeleted);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("filter for paged list of files by deleted not found");
                }
                else
                {
                    response = new ItemResponse<Paged<File>> { Item = page };
                }
            }
            catch (Exception ex)
            {

                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.DeleteById(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpPut("recover/{id:int}")]
        public ActionResult<SuccessResponse> Recover(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.RecoverById(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

    }
}