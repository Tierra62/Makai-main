import axios from "axios";
import {
  onGlobalSuccess,
  onGlobalError,
  API_HOST_PREFIX,
} from "./serviceHelpers";

const endpoint = { surveysService: `${API_HOST_PREFIX}/api/surveys` };

const getSurveyDetails = (id) => {
  const config = {
    method: "GET",
    url: endpoint.surveysService + "/details/" + id,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const surveysService = { getSurveyDetails };

export default surveysService;
