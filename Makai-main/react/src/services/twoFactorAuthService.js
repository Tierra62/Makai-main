import axios from "axios";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";

const endpoint = { twoFactorUrl: `${API_HOST_PREFIX}/api/2fa` };

const sendSMS = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.twoFactorUrl}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const checkSMS = (payload) => {
  const config = {
    method: "GET",
    url: `${endpoint.twoFactorUrl}?mobilePhone=${payload.mobilePhone}&code=${payload.code}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const twoFactorAuthService = { sendSMS, checkSMS };

export default twoFactorAuthService;
