import axios from "axios";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";

const ratingsService = {
  endpoint: `${API_HOST_PREFIX}/api/ratings`,
};

ratingsService.entityTypes = {
  blog: 1,
  user: 2,
  partner: 3,
  stand: 4,
  product: 5,
  chatgroup: 6,
};

ratingsService.addRating = (payload) => {
  let config = {
    method: "POST",
    url: `${ratingsService.endpoint}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

ratingsService.getAverage = (entityId, entityTypeId) => {
  let config = {
    method: "GET",
    url: `${ratingsService.endpoint}?ratingEntityTypeId=${entityTypeId}&ratingEntityId=${entityId}`,
    data: entityId,
    entityTypeId,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export default ratingsService;
