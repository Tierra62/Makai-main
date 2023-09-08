import axios from "axios";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";
import debug from "sabio-debug";
const _logger = debug.extend("advertisement");

const endpoint = {
  advertisementService: `${API_HOST_PREFIX}/api/advertisements`,
};

const advertisementInsert = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.advertisementService}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const advertisementGetAll = (pageIndex, pageSize) => {
  _logger("advertisementGetAll is working");
  const config = {
    method: "GET",
    url: `${endpoint.advertisementService}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const onUpdateAdvertisement = (id, payload) => {
  _logger("onUpdateAdvertisement is working");
  const config = {
    method: "PUT",
    url: `${endpoint.advertisementService}/${id}`,
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
    url: `${endpoint.advertisementService}/delete/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const advertisementService = {
  advertisementInsert,
  advertisementGetAll,
  onUpdateAdvertisement,
  onDeleteById,
};
export default advertisementService;
