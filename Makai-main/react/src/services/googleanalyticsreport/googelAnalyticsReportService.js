import axios from "axios";
const API_HOST_PREFIX = process.env.REACT_APP_API_HOST_PREFIX;
const endpoint = {
  googleReportService: `${API_HOST_PREFIX}/api/googleanalytics`,
};
const getTotalViews = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.googleReportService}/data`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};
const getBrowsers = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.googleReportService}/data`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};
const getDevices = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.googleReportService}/data`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};
export { getTotalViews, getBrowsers, getDevices };
