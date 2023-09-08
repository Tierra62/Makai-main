import axios from "axios";
import * as helper from "./serviceHelpers";

const sharedStoryService = {
  endpoint: `${helper.API_HOST_PREFIX}/api/sharestory`,
};

let getStories = (pageIndex, pageSize) => {
  let config = {
    method: "GET",
    url: `${sharedStoryService.endpoint}?pageindex=${pageIndex}&pagesize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const addStory = (payload) => {
  const config = {
    method: "POST",
    data: payload,
    url: sharedStoryService.endpoint,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

export { getStories, addStory };
