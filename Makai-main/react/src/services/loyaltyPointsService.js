import axios from "axios";
import {
  onGlobalSuccess,
  onGlobalError,
  API_HOST_PREFIX,
} from "../services/serviceHelpers";

const endpoint = `${API_HOST_PREFIX}/api/loyaltypoints`;

const getbyUserId = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint}/current?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByUserIdRunningTotals = () => {
  const config = {
    method: "GET",
    url: `${endpoint}/current/total`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const awardPoint = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint}`,
    data: payload,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const loginLog = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${API_HOST_PREFIX}/api/users/loginlog?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
export { getbyUserId, getByUserIdRunningTotals, awardPoint, loginLog };
