import axios from "axios";
import {
  API_HOST_PREFIX,
  onGlobalError,
  onGlobalSuccess,
} from "./serviceHelpers";
const endpoint = {
  externalLinkUrl: `${API_HOST_PREFIX}/api/externallinks`,
};
const addLink = (payload) => {
  const config = {
    method: "POST",
    url: endpoint.externalLinkUrl,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const updateLink = (id, payload) => {
  const config = {
    method: "PUT",
    url: `${endpoint.externalLinkUrl}/${id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const getLinks = () => {
  const config = {
    method: "GET",
    url: endpoint.externalLinkUrl,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const getByExLinkId = (id) => {
  const config = {
    method: "GET",
    url: `${endpoint.externalLinkUrl}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const deleteLink = (id) => {
  const config = {
    method: "DELETE",
    url: `${endpoint.externalLinkUrl}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const externalLinkService = {
  addLink,
  updateLink,
  getLinks,
  getByExLinkId,
  deleteLink,
};
export default externalLinkService;
