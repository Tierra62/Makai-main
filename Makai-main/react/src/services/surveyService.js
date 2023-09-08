import axios from "axios";
import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError,
} from "./serviceHelpers";

const endpoint = {
  siteReferenceUrl: `${API_HOST_PREFIX}/api/surveys`,
};
const getSurveyPage = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint.siteReferenceUrl}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getSurveyById = (id) => {
  const config = {
    method: "GET",
    url: `${endpoint.siteReferenceUrl}/details/${id}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const search = (input) => {
  const config = {
    method: "GET",
    url: `${endpoint.siteReferenceUrl}/search?pageIndex=0&pageSize=5&query=${input}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const surveyService = { getSurveyById, getSurveyPage, search };

export default surveyService;
