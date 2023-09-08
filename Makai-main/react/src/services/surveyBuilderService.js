import axios from "axios";
import { API_HOST_PREFIX, onGlobalError, onGlobalSuccess } from "./serviceHelpers";
const endpoint = {
     surveyUrl: `${API_HOST_PREFIX}/api/surveys`,
     surveyQuestionUrl: `${API_HOST_PREFIX}/api/surveyquestions`,
     questionAnswerUrl: `${API_HOST_PREFIX}/api/surveyquestions/answers`,
};

const getAllSurveys = (pageIndex, pageSize) => {
     const config = {
          method: "GET",
          url: `${endpoint.surveyUrl}/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
          withCredentials: true,
          crossdomain: true,
          headers: { "Content-Type": "application/json" },
     };
     return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getSurveysByCreator = (pageIndex, pageSize, id) => {
     const config = {
          method: "GET",
          url: `${endpoint.surveyUrl}/createdBy/${id}/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
          data: id,
          withCredentials: true,
          crossdomain: true,
          headers: { "Content-Type": "application/json" },
     };
     return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getSurveyDetails = (id) => {
     const config = {
          method: "GET",
          url: `${endpoint.surveyUrl}/details/${id}`,
          data: id,
          withCredentials: true,
          crossdomain: true,
          headers: { "Content-Type": "application/json" },
     };
     return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const createSurvey = (payload) => {
     const config = {
          method: "POST",
          url: endpoint.surveyUrl,
          data: payload,
          withCredentials: true,
          crossdomain: true,
          headers: { "Content-Type": "application/json" },
     };
     return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const deleteSurvey = (id) => {
     const config = {
          method: "DELETE",
          url: `${endpoint.surveyUrl}/${id}`,
          data: id,
          withCredentials: true,
          crossdomain: true,
          headers: { "Content-Type": "application/json" },
     };
     return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const createQuestion = (payload) => {
     const config = {
          method: "POST",
          url: endpoint.surveyQuestionUrl,
          data: payload,
          withCredentials: true,
          crossdomain: true,
          headers: { "Content-Type": "application/json" },
     };
     return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const deleteQuestion = (id) => {
     const config = {
          method: "DELETE",
          url: `${endpoint.surveyQuestionUrl}/${id}`,
          data: id,
          withCredentials: true,
          crossdomain: true,
          headers: { "Content-Type": "application/json" },
     };
     return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const addAnswer = (payload) => {
     const config = {
          method: "POST",
          url: endpoint.questionAnswerUrl,
          data: payload,
          withCredentials: true,
          crossdomain: true,
          headers: { "Content-Type": "application/json" },
     };
     return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const surveyBuilderService = {
     addAnswer,
     getSurveysByCreator,
     getAllSurveys,
     getSurveyDetails,
     createSurvey,
     deleteSurvey,
     createQuestion,
     deleteQuestion,
};
export default surveyBuilderService;
