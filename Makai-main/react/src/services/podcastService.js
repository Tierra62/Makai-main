import axios from "axios";
import debug from "sabio-debug";

const _logger = debug.extend("Podcasts");

const podcastsService = {
  endpoint: "https://api.remotebootcamp.dev/api/entities/podcasts",
};

let getPodcast = () => {
  let config = {
    method: "GET",
    url: podcastsService.endpoint,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

let addPodcast = (payload) => {
  _logger("payload", payload);
  let config = {
    method: "POST",
    url: podcastsService.endpoint,
    data: payload,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

let editPodcast = (id, payload) => {
  _logger("payload", payload);
  let config = {
    method: "PUT",
    url: `${podcastsService.endpoint}/${id}`,
    data: payload,
    crossdomain: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const deletePodcast = (id) => {
  const config = {
    method: "DELETE",
    url: `https://api.remotebootcamp.dev/api/entities/podcasts/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

export { getPodcast, addPodcast, editPodcast, deletePodcast };
