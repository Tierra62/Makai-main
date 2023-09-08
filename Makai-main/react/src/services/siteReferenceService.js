import axios from "axios";
import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError,
} from "./serviceHelpers";

const endpoint = {
  siteReferenceUrl: `${API_HOST_PREFIX}/api/sitereferences`,
};

const add = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.siteReferenceUrl}`,
    data: payload,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const getChart = () => {
  const config = {
    method: "GET",
    url: `${endpoint.siteReferenceUrl}/chartdata`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const siteReferenceService = { add, getChart };

export default siteReferenceService;
