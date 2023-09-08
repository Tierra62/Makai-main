import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import debug from "sabio-debug";
import surveyService from "../../services/surveyService";
import CurrentSurvey from "./CurrentSurvey";
import { Formik, Form, Field } from "formik";
import toastr from "toastr";

function SurveyAnalytics() {
  const _logger = debug.extend("survey");
  const [survey, setSurvey] = useState({ pageIndex: 0, pageSize: 10 });
  const [input] = useState({
    search: "",
  });

  useEffect(() => {
    surveyService
      .getSurveyPage(survey.pageIndex, survey.pageSize)
      .then(onGetSurveysSuccess)
      .catch(onGetSurveyError);
  }, []);

  const onGetSurveysSuccess = (response) => {
    const array = response.item.pagedItems;
    setSurvey((prevState) => {
      const sd = { ...prevState };
      sd.nameArray = array.map((el) => el.name);
      sd.arrayOfSurveys = array.map((el) => el.id);
      sd.instanceArray = array.map((el) => el.numberOfInstances);
      sd.clickedSurvey = "";
      sd.searched = "";
      return sd;
    });
  };

  const onGetSurveyError = () => {
    toastr["error"]("There was a problem getting the result", "error");
  };
  const onSurveyClicked = (response) => {
    const current = [response.item];
    setSurvey((prevState) => {
      const sd = { ...prevState };
      sd.clickedSurvey = current.map(mapSurvey);
      return sd;
    });
  };
  const mapSurvey = (surveyObj) => {
    return (
      <CurrentSurvey key={surveyObj.id} survey={surveyObj}></CurrentSurvey>
    );
  };
  const mapSearch = (surveyObj) => {
    return (
      <div className="card m-3 p-3">
        <h4>{surveyObj.name}</h4>
        <p>Survey Id: {surveyObj.id}</p>
        <p>Survey Description: {surveyObj.description}</p>
        <p>Question: {surveyObj.question}</p>
      </div>
    );
  };
  const onSearchButtonClicked = (values) => {
    surveyService
      .search(values.search)
      .then(onSearchSuccess)
      .catch(onSearchError);
  };
  const onSearchSuccess = (response) => {
    const searched = response.item.pagedItems;
    setSurvey((prevState) => {
      const sd = { ...prevState };
      sd.searched = searched.map(mapSearch);
      return sd;
    });
  };
  const onResetClicked = () => {
    setSurvey((prevState) => {
      const sd = { ...prevState };
      sd.searched = "";
      return sd;
    });
  };
  const onSearchError = (error) => {
    _logger("error", error);
    toastr.error("There is no result", "Error");
  };
  const series = [
    {
      name: "Survey",
      data: survey.instanceArray,
    },
  ];

  const options = {
    chart: {
      type: "bar",
      height: 350,
      events: {
        dataPointSelection: function (event, chartContext, config) {
          _logger("event", event, chartContext, config);
          const currentSurvey = survey.arrayOfSurveys[config.dataPointIndex];
          surveyService.getSurveyById(currentSurvey).then(onSurveyClicked);
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    title: {
      text: "Surveys",
      align: "center",
      margin: 50,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#263238",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: survey.nameArray,
    },
  };
  return (
    <React.Fragment>
      <Formik
        initialValues={input}
        onSubmit={onSearchButtonClicked}
        enableReinitialize={true}
      >
        <Form className="row my-3 d-flex flex-row-reverse">
          <div className="col-1">
            <button
              onClick={onResetClicked}
              type="reset"
              className="btn btn-outline-dark"
            >
              X
            </button>
          </div>
          <div className="col-2 ">
            <button type="submit" className="btn btn-outline-primary">
              Search
            </button>
          </div>

          <div className="col-4">
            <Field
              className="form-control"
              name="search"
              type="text"
              id="search"
            ></Field>
          </div>
        </Form>
      </Formik>
      <div className="card">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        ></ReactApexChart>
      </div>
      <div className="mt-2">{!survey.searched && survey.clickedSurvey}</div>
      <div className="mt-2">{survey.searched}</div>
    </React.Fragment>
  );
}

export default SurveyAnalytics;
