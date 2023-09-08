import axios from "axios";
import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError,
} from "../services/serviceHelpers";

const endpoint = {
  insuranceOptionService: `${API_HOST_PREFIX}/api/insurance`,
};

const add = (payload) => {
  const config = {
    method: "POST",
    url: endpoint.insuranceOptionService,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

// For later use - Probably on some ~View Order page

const update = (id, payload) => {
  const config = {
    method: "PUT",
    url: `${endpoint.insuranceOptionService}/${id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const get = (id) => {
  const config = {
    method: "GET",
    url: `${endpoint.insuranceOptionService}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getAll = () => {
  const config = {
    method: "GET",
    url: `${endpoint.insuranceOptionService}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const deleteById = (id) => {
  const config = {
    method: "DELETE",
    url: `${endpoint.insuranceOptionService}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export { add, update, get, getAll, deleteById };
