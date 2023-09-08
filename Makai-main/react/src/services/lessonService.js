import axios from "axios";
import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError,
} from "./serviceHelpers";

const lessonService = {
  endpoint: `${API_HOST_PREFIX}/api/lessons`,
};

lessonService.createLesson = (payload) => {
  const config = {
    method: "POST",
    url: lessonService.endpoint,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

lessonService.updateLesson = (payload, id) => {
  const config = {
    method: "PUT",
    url: lessonService.endpoint + `/${id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

lessonService.getAll = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      lessonService.endpoint + `/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

lessonService.getBySiteTrainingId = (pageIndex, pageSize, siteTrainingId) => {
  const config = {
    method: "GET",
    url:
      lessonService.endpoint +
      `/paginate/${siteTrainingId}/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

lessonService.deleteLesson = (id) => {
  const config = {
    method: "DELETE",
    url: lessonService.endpoint + `/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export default lessonService;
