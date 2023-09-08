import axios from "axios";
import { onGlobalError, onGlobalSuccess } from "./serviceHelpers";

const API_HOST_PREFIX = process.env.REACT_APP_API_HOST_PREFIX;

const endpoint = { stripeService: `${API_HOST_PREFIX}/api` };

const addSession = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.stripeService}/checkouts`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getLineItems = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.stripeService}/checkouts/items`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const addOrderDetails = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.stripeService}/checkouts/success`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const reservationAddSession = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.stripeService}/checkouts/reservation`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const addReservationOrderDetails = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.stripeService}/checkouts/reservation/success`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const addAccount = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.stripeService}/accounts`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getAccount = (id) => {
  const config = {
    method: "GET",
    url: `${endpoint.stripeService}/stripe/user/${id}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const addAccountLink = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.stripeService}/accounts/links`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const addAccountToDatabase = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.stripeService}/stripe/user`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const getAllAccounts = () => {
  const config = {
    method: "GET",
    url: `${endpoint.stripeService}/stripe/user`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const addTransactionReceipt = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.stripeService}/stripe/receipts`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getAllTransactions = () => {
  const config = {
    method: "GET",
    url: `${endpoint.stripeService}/stripe/receipts`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const transferPayment = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.stripeService}/accounts/transfer`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};
const getTransferDetails = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.stripeService}/accounts/transferId`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getProductById = (id) => {
  const config = {
    method: "GET",
    url: `${endpoint.stripeService}/cart/${id}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export {
  addSession,
  getLineItems,
  addAccount,
  addAccountLink,
  getAccount,
  addAccountToDatabase,
  addOrderDetails,
  addTransactionReceipt,
  transferPayment,
  getTransferDetails,
  getAllTransactions,
  getAllAccounts,
  getProductById,
  addReservationOrderDetails,
  reservationAddSession,
};
