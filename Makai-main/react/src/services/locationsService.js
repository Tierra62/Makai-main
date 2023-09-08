import axios from "axios";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";
const endpoint = { locationsUrl: `${API_HOST_PREFIX}/api/locations` };

const add = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.locationsUrl}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then((response) => {
      return { ...payload, id: response.data.item };
    })
    .catch(onGlobalError);
};

const update = (id, payload) => {
  const config = {
    method: "PUT",
    url: `${endpoint.locationsUrl}/${id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByLocationType = (id) => {
  const config = {
    method: "GET",
    url: `${endpoint.locationsUrl}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const locationsService = { add, update, getByLocationType };

export default locationsService;
