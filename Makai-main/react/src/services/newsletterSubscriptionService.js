import axios from "axios";
import {
  API_HOST_PREFIX,
  onGlobalError,
  onGlobalSuccess,
} from "./serviceHelpers";
import debug from "sabio-debug";
const _logger = debug.extend("NewsletterSub");

let newsletterSubscriptionService = {
  endpoint: `${API_HOST_PREFIX}/api/newsletter/subscriptions`,
};

newsletterSubscriptionService.create = (payload) => {
  const config = {
    method: "POST",
    url: newsletterSubscriptionService.endpoint,
    data: payload,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

newsletterSubscriptionService.edit = (payload) => {
  const config = {
    method: "PUT",
    url: `${newsletterSubscriptionService.endpoint}/?email=${payload.email}`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

newsletterSubscriptionService.getAll = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      newsletterSubscriptionService.endpoint +
      "?pageIndex=" +
      pageIndex +
      "&pageSize=" +
      pageSize,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

newsletterSubscriptionService.getAllSubscribed = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      newsletterSubscriptionService.endpoint +
      "/subscribed" +
      "?pageIndex=" +
      pageIndex +
      "&pageSize=" +
      pageSize,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

newsletterSubscriptionService.getAllNotSubscribed = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      newsletterSubscriptionService.endpoint +
      "/unsubscribed" +
      "?pageIndex=" +
      pageIndex +
      "&pageSize=" +
      pageSize,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

newsletterSubscriptionService.unsubscribe = (payload) => {
  _logger("unsubscribe is working");
  const config = {
    method: "PUT",
    url: `${newsletterSubscriptionService.endpoint}`,
    data: payload,
    withCredentials: true,
    crossDomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
export default newsletterSubscriptionService;
