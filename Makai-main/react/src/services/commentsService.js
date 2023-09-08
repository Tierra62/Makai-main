import axios from "axios";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";

const commentsService = {
  endpoint: { commentsUrl: `${API_HOST_PREFIX}/api/comments` },
};

commentsService.addComment = (payload) => {
  let config = {
    method: "POST",
    url: `${commentsService.endpoint.commentsUrl}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then((resp) => {
      return { ...resp.data, payload };
    })
    .catch(onGlobalError);
};

commentsService.getByEntity = (entityTypeId, entityId) => {
  let config = {
    method: "GET",
    url: `${commentsService.endpoint.commentsUrl}/entityType/${entityTypeId}/entity/${entityId}`,
    data: entityId,
    entityTypeId,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export default commentsService;
