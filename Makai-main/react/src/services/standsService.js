import axios from "axios";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";

const endpoint = { standsUrl: `${API_HOST_PREFIX}/api/stands` };

const add = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.standsUrl}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const update = (id, payload) => {
  const config = {
    method: "PUT",
    url: `${endpoint.standsUrl}/${id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByGeo = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.standsUrl}/geo`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getAllV2 = () => {
  const config = {
    method: "GET",
    url: `${endpoint.standsUrl}/reservation`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getAll = () => {
  const config = {
    method: "GET",
    url: `${endpoint.standsUrl}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const standsService = { add, update, getByGeo, getAllV2, getAll };
export default standsService;
