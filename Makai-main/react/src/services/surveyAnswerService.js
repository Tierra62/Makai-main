import axios from "axios";
import {
  onGlobalSuccess,
  onGlobalError,
  API_HOST_PREFIX,
} from "./serviceHelpers";

const endpoint = { surveyAnswers: `${API_HOST_PREFIX}/api/surveys/answers` };

const add = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.surveyAnswers}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const surveyAnswerService = { add };

export default surveyAnswerService;
