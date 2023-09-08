import axios from "axios";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";
import debug from "sabio-debug";
const _logger = debug.extend("training");

const endpoint = {
  trainingService: `${API_HOST_PREFIX}/api/training`,
};

const trainingInsert = (payload) => {
  _logger("trainingInsert is working");
  const config = {
    method: "POST",
    url: `${endpoint.trainingService}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const onUpdateTraining = (id, payload) => {
  _logger("onUpdateTraining is working");
  const config = {
    method: "PUT",
    url: `${endpoint.trainingService}/${id}`,
    data: payload,
    withCredentials: true,
    crossDomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const onDeleteById = (id) => {
  _logger("onDeleteById is working");
  const config = {
    method: "DELETE",
    url: `${endpoint.trainingService}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const trainingGetAll = (pageIndex, pageSize, isDeleted) => {
  _logger("trainingGetAll is working");
  const config = {
    method: "GET",
    url: `${endpoint.trainingService}?pageIndex=${pageIndex}&pageSize=${pageSize}&isDeleted=${isDeleted}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const search = (pageIndex, pageSize, query, isDeleted) => {
  _logger("search is working");
  const config = {
    method: "GET",
    url: `${endpoint.trainingService}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}&isDeleted=${isDeleted}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getByCategoryId = (pageIndex, pageSize, categoryId, isDeleted) => {
  _logger("trainingGetAll is working");
  const config = {
    method: "GET",
    url: `${endpoint.trainingService}/category/${categoryId}?pageIndex=${pageIndex}&pageSize=${pageSize}&isDeleted=${isDeleted}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByCreatedBy = (pageIndex, pageSize, isDeleted, id) => {
  _logger("getByCreatedBy is working");
  const config = {
    method: "GET",
    url: `${endpoint.trainingService}/user/${id}?pageIndex=${pageIndex}&pageSize=${pageSize}&isDeleted=${isDeleted}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getById = (id, payload) => {
  _logger("getById is working");
  const config = {
    method: "GET",
    url: `${endpoint.trainingService}/${id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const siteTrainingService = {
  trainingInsert,
  onUpdateTraining,
  trainingGetAll,
  onDeleteById,
  search,
  getByCategoryId,
  getByCreatedBy,
  getById,
};
export default siteTrainingService;
