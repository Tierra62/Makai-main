import axios from "axios";
import debug from "sabio-debug";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";

const endpoint = {
  highlightReelUrl: `${API_HOST_PREFIX}/api/userphotos`,
  _logger: debug.extend("HighlightReelService"),
};

const addPhotos = (payload) => {
  const config = {
    method: "POST",
    url: endpoint.highlightReelUrl,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getApproved = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      endpoint.highlightReelUrl +
      `/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getNotApproved = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      endpoint.highlightReelUrl +
      `/unapproved?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const approveImage = (payload) => {
  const config = {
    method: "PUT",
    url: endpoint.highlightReelUrl + `/approved/${payload.id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const highlightReelService = {
  addPhotos,
  getApproved,
  getNotApproved,
  approveImage,
};
export default highlightReelService;
