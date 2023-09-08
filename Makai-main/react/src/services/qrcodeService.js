import axios from "axios";
import * as helper from "./serviceHelpers";

const endpoint = {
  url: `${helper.API_HOST_PREFIX}/api/stand/codes`,
};

const addQrCode = (standId) => {
  const config = {
    method: "POST",
    url: `${endpoint.url}/${standId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getById = (id) => {
  const config = {
    method: "GET",
    url: `${endpoint.url}/${id}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const qrcodeService = { addQrCode, getById };
export default qrcodeService;
