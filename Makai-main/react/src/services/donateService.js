import axios from "axios";
import * as helper from "./serviceHelpers";

const donateService = {
  endpoint: `${helper.API_HOST_PREFIX}/api/donate`,
};

let getCharities = (pageIndex, pageSize) => {
  let config = {
    method: "GET",
    url: `${donateService.endpoint}/charitablefund/?pageindex=${pageIndex}&pagesize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getCharitableFundById = (id) => {
  const config = {
    method: "GET",
    url: donateService.endpoint + `/charitablefund/${id}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const addDonation = (payload) => {
  const config = {
    method: "POST",
    data: payload,
    url: donateService.endpoint + "/donation",
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export { getCharities, getCharitableFundById, addDonation };
