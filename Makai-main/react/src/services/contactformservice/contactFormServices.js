import axios from "axios";
import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError,
} from "../serviceHelpers";

const contactFormServices = {
  endpoint: { emailUrl: `${API_HOST_PREFIX}/api/emails/contactus` },
};

contactFormServices.sendMessage = (payload) => {
  let config = {
    method: "POST",
    url: `${contactFormServices.endpoint.emailUrl}`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export default contactFormServices;
