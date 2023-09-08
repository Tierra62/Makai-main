import axios from "axios";
import {
  onGlobalError,
  API_HOST_PREFIX,
  onGlobalSuccess,
} from "./serviceHelpers";

const endpoint = {
  recommendationsService: `${API_HOST_PREFIX}/api/recommendations`,
};

const getAllPagedRecommendations = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint.recommendationsService}/paginate/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getAllRecommendations = () => {
  const config = {
    method: "GET",
    url: `${endpoint.recommendationsService}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const AddRecommendation = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.recommendationsService}`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const updateIsActive = (id, IsActive) => {
  const config = {
    method: "PUT",
    url: `${endpoint.recommendationsService}/${id}/active/?isActive=${IsActive}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const updateIsDeleted = (id, IsDeleted) => {
  const config = {
    method: "PUT",
    url: `${endpoint.recommendationsService}/${id}/delete/?isDeleted=${IsDeleted}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const recommendationsService = {
  getAllPagedRecommendations,
  getAllRecommendations,
  AddRecommendation,
  updateIsActive,
  updateIsDeleted,
};

export default recommendationsService;
