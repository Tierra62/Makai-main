import axios from "axios";
import {
  onGlobalError,
  API_HOST_PREFIX,
  onGlobalSuccess,
} from "./serviceHelpers";

const endpoint = { reservationService: `${API_HOST_PREFIX}/api/reservations` };

const addReservation = (payload) => {
  const config = {
    method: "POST",
    url: endpoint.reservationService,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config)
    .then((response) => response)
    .catch(onGlobalError);
};

const updateStatusByChargeId = (chargeId, statusId) => {
  const config = {
    method: "PUT",
    url: `${endpoint.reservationService}/${chargeId}?statusId=${statusId}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const reservationService = { addReservation, updateStatusByChargeId };

export default reservationService;
