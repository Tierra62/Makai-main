import axios from "axios";
import {
  API_HOST_PREFIX,
  onGlobalError,
  onGlobalSuccess,
} from "./serviceHelpers";
const endpoint = {
  emergencyContactsUrl: `${API_HOST_PREFIX}/api/emergency/contacts`,
};

const create = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.emergencyContactsUrl}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByUserId = (userId) => {
  const config = {
    method: "GET",
    url: `${endpoint.emergencyContactsUrl}/${userId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByUserIdPaginated = (pageIndex, pageSize, userId) => {
  const config = {
    method: "GET",
    url: `${endpoint.emergencyContactsUrl}/admin/?pageIndex=${pageIndex}&pageSize=${pageSize}&userId=${userId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const deleteById = (id) => {
  const config = {
    method: "DELETE",
    url: `${endpoint.emergencyContactsUrl}/${id}`,
    withCredentials: true,
    crossdomain: true,
    header: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const update = (id, payload) => {
  const config = {
    method: "PUT",
    url: `${endpoint.emergencyContactsUrl}/${id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const emergencyContactService = {
  create,
  getByUserId,
  getByUserIdPaginated,
  deleteById,
  update,
};
export default emergencyContactService;
