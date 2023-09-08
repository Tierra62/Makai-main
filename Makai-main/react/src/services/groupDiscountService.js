import axios from "axios";

import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError,
} from "./serviceHelpers";

let endpoint = { groupDiscountUrl: `${API_HOST_PREFIX}/api/groupdiscounts` };

const createGroupDiscount = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.groupDiscountUrl}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

let getGroupDiscounts = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint.groupDiscountUrl}/partner?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

let updateGroupDiscount = (id, payload) => {
  const config = {
    method: "PUT",
    url: `${endpoint.groupDiscountUrl}/${id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

let deleteDiscount = (isDeleted, id) => {
  const config = {
    method: "DELETE",
    url: `${endpoint.groupDiscountUrl}/${id}/${isDeleted}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

let activeDiscount = (isActive, id) => {
  const config = {
    method: "PUT",
    url: `${endpoint.groupDiscountUrl}/status/${id}/${isActive}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export {
  createGroupDiscount,
  getGroupDiscounts,
  updateGroupDiscount,
  deleteDiscount,
  activeDiscount,
};
