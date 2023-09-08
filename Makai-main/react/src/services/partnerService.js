import axios from "axios";
import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError,
} from "./serviceHelpers";

const endpoint = { partnerService: `${API_HOST_PREFIX}/api/partners` };

const registerPartner = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.partnerService}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getAllPartners = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint.partnerService}/paginate/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const searchPartners = (pageIndex, pageSize, searchQuery) => {
  const config = {
    method: "GET",
    url: `${endpoint.partnerService}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${searchQuery}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export { registerPartner, getAllPartners, searchPartners };
