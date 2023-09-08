import axios from "axios";
import debug from "sabio-debug";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";

const _logger = debug.extend("location");
const endpoint = { chatService: `${API_HOST_PREFIX}/api/rooms` };

const getNewVideoChat = (payload) => {
  _logger("videoChatService payload", payload);
  const config = {
    method: "POST",
    data: payload,
    url: endpoint.chatService,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const getRoomToken = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.chatService}/token`,
    data: payload,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getActiveRoomList = (limit) => {
  const config = {
    method: "GET",
    url: `${endpoint.chatService}/active?limit=${limit}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const deleteRoom = (roomName) => {
  const config = {
    method: "DELETE",
    url: `${endpoint.chatService}/room?roomName=${roomName}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const getAllStats = (index, size) => {
  const config = {
    method: "GET",
    url: `${endpoint.chatService}/statistics?PageIndex=${index}&PageSize=${size}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const getStatsByCreator = (userId, index, size) => {
  const config = {
    method: "GET",
    url: `${endpoint.chatService}/statistics/createdby/${userId}?PageIndex=${index}&PageSize=${size}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const getStatsByDayHost = (days) => {
  const config = {
    method: "GET",
    url: `${endpoint.chatService}/statistics/dailyhost?days=${days}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const getStatsDaily = (days) => {
  const config = {
    method: "GET",
    url: `${endpoint.chatService}/statistics/daily?days=${days}`,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const createStatistics = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.chatService}/statistics`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const insertParticipants = (payload) => {
  const config = {
    method: "POST",
    url: `${endpoint.chatService}/statistics/participant`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
export default {
  getNewVideoChat,
  getRoomToken,
  getActiveRoomList,
  deleteRoom,
  getAllStats,
  createStatistics,
  insertParticipants,
  getStatsByCreator,
  getStatsByDayHost,
  getStatsDaily,
};
