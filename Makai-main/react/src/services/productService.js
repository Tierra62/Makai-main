import axios from "axios";
import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError,
} from "./serviceHelpers";

const endpoint = { productUrl: `${API_HOST_PREFIX}/api/products` };

const getAll = () => {
  const config = {
    method: "GET",
    url: `${endpoint.productUrl}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getAllPag = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint.productUrl}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getByStandId = (standId) => {
  const config = {
    method: "GET",
    url: `${endpoint.productUrl}/stand/${standId}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getByProdTypeAndStandId = (
  pageIndex,
  pageSize,
  productTypeId,
  standId
) => {
  const config = {
    method: "GET",
    url: `${
      endpoint.productUrl
    }/type/stand/?pageIndex=${pageIndex}&pageSize=${pageSize}&productTypeId=${
      productTypeId ? productTypeId : ""
    }&standId=${standId ? standId : ""}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getByProdTypeAndMultipleStandId = (
  pageIndex,
  pageSize,
  productTypeId,
  standId
) => {
  if (Array.isArray(standId)) {
    let standIdsString = "";

    for (let i = 0; i < standId.length; i++) {
      const element = `&standId=${standId[i]}`;
      standIdsString += element;
    }
    const config = {
      method: "GET",
      url: `${
        endpoint.productUrl
      }/type/stands/?pageIndex=${pageIndex}&pageSize=${pageSize}&productTypeId=${
        productTypeId ? productTypeId : ""
      }${standId ? standIdsString : ""}`,
      crossdomain: true,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
  }
};

const search = (pageIndex, pageSize, query) => {
  const config = {
    method: "GET",
    url: `${endpoint.productUrl}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getAllFave = () => {
  const config = {
    method: "GET",
    url: `${endpoint.productUrl}/favorites/all`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getAllFavePag = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint.productUrl}/favorites?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const add = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.productUrl}`,
    data: payload,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const addFavorite = (productId) => {
  const config = {
    method: "POST",
    url: `${endpoint.productUrl}/favorites/${productId}`,
    data: productId,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const deleteFavorite = (productId) => {
  const config = {
    method: "DELETE",
    url: `${endpoint.productUrl}/favorites/${productId}`,
    data: productId,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const productService = {
  getAll,
  getAllPag,
  getByProdTypeAndStandId,
  getByProdTypeAndMultipleStandId,
  getByStandId,
  search,
  getAllFave,
  getAllFavePag,
  add,
  addFavorite,
  deleteFavorite,
};
export default productService;
