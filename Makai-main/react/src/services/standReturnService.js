import axios from "axios";
import {
    onGlobalError,
    onGlobalSuccess,
    API_HOST_PREFIX,
} from "./serviceHelpers";

const endpoint = { standReturnsUrl: `${API_HOST_PREFIX}/api/standreturns`};

const add = (payload) => {
    const config = {
        method: "POST",
        url: `${endpoint.standReturnsUrl}`,
        data: payload,
        crossdomain: true,
        withCredentials: true,
        headers: { "Content-Type" : "application/json"},
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const updateImage = (id, payload) => {
    const config = {
        method: "PUT",
        url: `${endpoint.standReturnsUrl}/${id}`,
        data: payload,
        withCredentaials: true,
        crossdomain: true,
        headers: { "Content-Type" : "application/json" },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByUserIdPag = (userId, pageIndex, pageSize) => {
    const config = {
        method: "GET",
        url: `${endpoint.standReturnsUrl}/user/${userId}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        crossdomain: true,
        withCredentials: true,
        headers: { "content-Type" : "application/json" },
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByStandIdPag = (standId, pageIndex, pageSize) => {
    const config = {
        method: "GET",
        url: `${endpoint.standReturnsUrl}/stand/${standId}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        crossdomain: true,
        withCredentials: true,
        headers: { "Content-Type" : "application/json" },
    };
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getAllReturnsPag = (pageIndex, pageSize) => {
    const config = {
        method: "GET",
        url: `${endpoint.standReturnsUrl}/getall/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        crossdomain: true,
        withCredentials: true,
        headers: { "Content-Type" : "application/json" },
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};  

const standReturnsService = {
    getAllReturnsPag,
    getByStandIdPag,
    getByUserIdPag,
    updateImage,
    add,
};

export default standReturnsService;