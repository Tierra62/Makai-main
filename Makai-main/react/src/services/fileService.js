import axios from "axios";
import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError,
} from "../services/serviceHelpers";

const endpoint = {
  filesService: `${API_HOST_PREFIX}/api/files/upload`,
  filesServices: `${API_HOST_PREFIX}/api/files`,
};

const uploadFiles = (payload) => {
  const config = {
    method: "POST",
    url: endpoint.filesService,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "multipart/form-data" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByDeleted = (pageIndex, pageSize, isDeleted) => {
  const config = {
    method: "GET",
    url: `${endpoint.filesServices}/deleted?pageIndex=${pageIndex}&pageSize=${pageSize}&isDeleted=${isDeleted}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getAll = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint.filesServices}/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const searchByCreatedBy = (pageIndex, pageSize, userId) => {
  const config = {
    method: "GET",
    url: `${endpoint.filesServices}/?${pageIndex}&pageSize=${pageSize}&createdId=${userId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const deleteFile = (id) => {
  const config = {
    method: "PUT",
    url: `${endpoint.filesServices}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const searchFilesByQuery = (pageIndex, pageSize, query) => {
  const config = {
    method: "GET",
    url: `${endpoint.filesServices}/query?${pageIndex}&pageSize=${pageSize}&query=${query}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const filterFiles = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.filesServices}/fileType`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const recoverFile = (recoverId) => {
  const config = {
    method: "PUT",
    url: `${endpoint.filesServices}/recover/${recoverId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export {
  uploadFiles,
  getAll,
  searchByCreatedBy,
  deleteFile,
  searchFilesByQuery,
  getByDeleted,
  recoverFile,
  filterFiles,
};
