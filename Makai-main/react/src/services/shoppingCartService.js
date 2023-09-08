import axios from "axios";
import {
  onGlobalError,
  API_HOST_PREFIX,
  onGlobalSuccess,
} from "./serviceHelpers";

const endpoint = {
  shoppingCartUrl: `${API_HOST_PREFIX}/api/shoppingcart`,
};

const getCart = () => {
  const config = {
    method: "GET",
    url: endpoint.shoppingCartUrl,
    crossdomain: true,
    withCredential: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const addCart = (payload) => {
  const config = {
    method: "POST",
    url: endpoint.shoppingCartUrl,
    data: payload,
    crossdomain: true,
    withCredential: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const updateCartById = (id, payload) => {
  const config = {
    method: "PUT",
    url: `${endpoint.shoppingCartUrl}/${id}`,
    data: payload,
    crossdomain: true,
    withCredential: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const deleteCartById = (id) => {
  const config = {
    method: "DELETE",
    url: `${endpoint.shoppingCartUrl}/${id}`,
    crossdomain: true,
    withCredential: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const shoppingCartService = {
  getCart,
  addCart,
  updateCartById,
  deleteCartById,
};

export default shoppingCartService;
