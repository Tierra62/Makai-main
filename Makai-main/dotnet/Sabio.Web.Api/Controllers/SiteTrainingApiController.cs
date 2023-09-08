﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Services.Interfaces;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Models.Domain.SiteTrainings;
using Microsoft.AspNetCore.Authorization;
using Sabio.Web.Models.Responses;
using System.Collections.Generic;
using System;
using Sabio.Models;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Sabio.Models.Requests.SiteTrainings;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/training")]
    [ApiController]
    public class SiteTrainingApiController : BaseApiController
    {
        private ISiteTrainingService _service = null;
        private IAuthenticationService<int> _authService = null;
        public SiteTrainingApiController(ISiteTrainingService service
            , ILogger<SiteTrainingApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }
        [HttpGet]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Paged<SiteTraining>>> SelectAll(int pageIndex, int pageSize, bool isDeleted)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<SiteTraining> page = _service.SelectAll( pageIndex, pageSize, isDeleted);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Site Trainings not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<SiteTraining>>() { Item = page };
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
        [HttpGet("search")]
        [AllowAnonymous]
        public ActionResult<ItemResponse<Paged<SiteTraining>>> Search(int pageIndex, int pageSize, string query, bool isDeleted)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<SiteTraining> page = _service.Search(pageIndex, pageSize, query, isDeleted);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("Product not found");
                }
                else
                {
                    response = new ItemResponse<Paged<SiteTraining>> { Item = page };
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
        [HttpGet("user/{userId:int}")]
        public ActionResult<ItemResponse<Paged<SiteTraining>>> SelectByCreatedBy(int pageIndex, int pageSize, int userId, bool isDeleted)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<SiteTraining> page = _service.SelectByCreatedBy(pageIndex, pageSize, userId, isDeleted);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<SiteTraining>> { Item = page };
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
        [HttpGet("category/{categoryId:int}")]
        public ActionResult<ItemResponse<Paged<SiteTraining>>> SelectByCategoryId(int pageIndex, int pageSize, int categoryId, bool isDeleted)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<SiteTraining> page = _service.SelectByCategoryId(pageIndex, pageSize, categoryId, isDeleted);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<SiteTraining>> { Item = page };
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
        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<SiteTraining>> SelectById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                SiteTraining siteTraining = _service.SelectById(id);

                if (siteTraining == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found");
                }
                else
                {
                    response = new ItemResponse<SiteTraining> { Item = siteTraining };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);
        }
        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(SiteTrainingsAddRequest request)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(request, userId);
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
        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(SiteTrainingsUpdateRequest request)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(request, userId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.ToString());
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
    }
    }
