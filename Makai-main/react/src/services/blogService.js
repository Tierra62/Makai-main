import axios from "axios";
import * as helper from "./serviceHelpers";

const blogService = {
  endpoint: `${helper.API_HOST_PREFIX}/api/blogs`,
};

let getBlogs = (pageIndex, pageSize) => {
  let config = {
    method: "GET",
    url: `${blogService.endpoint}?pageindex=${pageIndex}&pagesize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const searchBlog = (pageIndex, pageSize, searchTerm) => {
  const config = {
    method: "GET",
    url: `${blogService.endpoint}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${searchTerm}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getByCategoryId = (categoryId, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${blogService.endpoint}/category/${categoryId}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const addBlog = (payload) => {
  const config = {
    method: "post",
    data: payload,
    url: blogService.endpoint,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export { getBlogs, searchBlog, getByCategoryId, addBlog };
