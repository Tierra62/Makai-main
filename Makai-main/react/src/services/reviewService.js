import axios from "axios";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";

const endpoint = { reviewsUrl: `${API_HOST_PREFIX}/api/reviews` };

const addReview = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.reviewsUrl}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const updateReview = (id, payload) => {
  const config = {
    method: "PUT",
    url: `${endpoint.reviewsUrl}/${id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const deleteReview = (id) => {
  const config = {
    method: "DELETE",
    url: `${endpoint.reviewsUrl}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByEntityId = (id) => {
  const config = {
    method: "GET",
    url: `${endpoint.reviewsUrl}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const reviewService = { addReview, updateReview, deleteReview, getByEntityId };

export default reviewService;
