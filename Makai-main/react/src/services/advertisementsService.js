import axios from "axios";
import { API_HOST_PREFIX } from "./serviceHelpers.js";
import debug from "sabio-debug";

const _loggerDP = debug.extend("advertisement");

const advertisementsService = {
  endpoint: `${API_HOST_PREFIX}/api/advertisements`,
};

advertisementsService.getAll = (pageIndex, pageSize) => {
  _loggerDP("advertisementGetAll is working");
  const config = {
    method: "GET",
    url: `${advertisementsService.endpoint}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config);
};

export default advertisementsService;
