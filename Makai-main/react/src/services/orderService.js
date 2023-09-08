import axios from "axios";
import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError,
} from "../services/serviceHelpers";

const endpoint = { orderService: `${API_HOST_PREFIX}/api/orders` };

const getAllOrders = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint.orderService}/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getOrdersByStandId = (pageIndex, pageSize, standId) => {
  const config = {
    method: "GET",
    url: `${endpoint.orderService}/stands?pageIndex=${pageIndex}&pageSize=${pageSize}&standId=${standId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getOrdersByUserId = (pageIndex, pageSize, userId) => {
  const config = {
    method: "GET",
    url: `${endpoint.orderService}/users?pageIndex=${pageIndex}&pageSize=${pageSize}&userId=${userId}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getCurrentUserOrderItems = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint.orderService}/items/history?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getCurrentUserOrders = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint.orderService}/history?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getCurrentUserPayments = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint.orderService}/payments?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const addOrder = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.orderService}`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const updateOrder = (id, payload) => {
  const config = {
    method: "PUT",
    url: `${endpoint.orderService}/${id}`,
    data: payload,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const updateOrderStatus = (id, statusId) => {
  const config = {
    method: "PUT",
    url: `${endpoint.orderService}/${id}/status/${statusId}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const checkOutOrder = (id) => {
  const config = {
    method: "PUT",
    url: `${endpoint.orderService}/checkout/${id}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const checkInOrder = (id) => {
  const config = {
    method: "PUT",
    url: `${endpoint.orderService}/check/${id}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const checkOutItem = (itemId) => {
  const config = {
    method: "PUT",
    url: `${endpoint.orderService}/items/checkout/${itemId}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const checkInItem = (itemId) => {
  const config = {
    method: "PUT",
    url: `${endpoint.orderService}/check/${itemId}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export {
  getAllOrders,
  getOrdersByStandId,
  getOrdersByUserId,
  getCurrentUserOrderItems,
  getCurrentUserOrders,
  getCurrentUserPayments,
  updateOrder,
  checkOutOrder,
  checkInOrder,
  checkOutItem,
  checkInItem,
  addOrder,
  updateOrderStatus,
};
