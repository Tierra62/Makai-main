import axios from "axios";
import {
  onGlobalSuccess,
  onGlobalError,
  API_HOST_PREFIX,
} from "./serviceHelpers";

const endpoint = { surveyInstance: `${API_HOST_PREFIX}/api/surveyInstance` };

const add = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.surveyInstance}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const surveyInstanceService = { add };

export default surveyInstanceService;
