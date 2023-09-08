import axios from "axios";

import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";

const endpoint = { weatherService: `${API_HOST_PREFIX}/api/weather` };

const getWeatherData = (lat, long) => {
  const config = {
    method: "GET",
    url: `${endpoint.weatherService}/${lat},${long}`,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const getSearchWeatherData = (searchValue) => {
  const config = {
    method: "GET",
    url: `${endpoint.weatherService}/${searchValue}`,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export default { getWeatherData, getSearchWeatherData };
