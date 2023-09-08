import React, { useState, useEffect } from "react";
import WeatherDisplayCard from "./WeatherDisplayCard";
import weatherService from "services/weatherService";
import debug from "sabio-debug";
import { Formik, Form, Field } from "formik";
import { Col, Row } from "react-bootstrap";
import weatherSchema from "schemas/weatherSchema";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
const _logger = debug.extend("location");

const WeatherDisplay = () => {
  const [weatherData, setWeatherData] = useState({
    city: "",
    weatherIcon: "",
    condition: "",
    precipitation: "",
    temperature: 0,
    highestTemperature: 0,
    lowestTemperature: 0,
    windSpeed: 0,
    windDirection: "",
  });
  const [showSearchBar, setShowSearchBar] = useState(true);
  const searchQuery = {
    locationSearch: "",
  };
  useEffect(() => {
    if ("geolocation" in navigator) {
      _logger("Available");
      navigator.geolocation.getCurrentPosition(
        getCurrentPositionSuccess,
        getCurrentPositionError
      );
    } else {
      _logger("Not Available");
      setShowSearchBar(true);
    }
  }, []);

  const getCurrentPositionSuccess = (position) => {
    _logger("position success", position);
    weatherService
      .getWeatherData(position.coords.latitude, position.coords.longitude)
      .then(onGetWeatherDataSuccess)
      .catch(onGetWeatherDataError);
  };

  const getCurrentPositionError = (err) => {
    _logger("position err", err);
    Toastify({
      text: "Unable To Find Your Location, please type in your location manually",
      className: "error",
      style: {
        background: "crimson",
      },
    }).showToast();
    setShowSearchBar(true);
  };

  const onGetWeatherDataError = (err) => {
    Toastify({
      text: "Unable To Find Your Current Weather Conditions, please refresh to Try Again",
      className: "error",
      style: {
        background: "crimson",
      },
    }).showToast();
    _logger("get weather data error", err);
  };

  const onGetWeatherDataSuccess = (data) => {
    _logger("get weather data", data);
    _logger("typeof", typeof data.item.current.temp_f);
    const newWeatherData = {
      city: data.item.location.name,
      weatherIcon: data.item.current.condition.icon,
      condition: data.item.current.condition.text,
      precipitation: data.item.current.precip_in || "0",
      temperature: data.item.current.temp_f,
      highestTemperature: data.item.current.temp_f,
      lowestTemperature: data.item.current.temp_c,
      windSpeed: data.item.current.wind_mph,
      windDirection: data.item.current.wind_dir,
    };
    setWeatherData(newWeatherData);

    _logger("get weather data error", newWeatherData);
  };

  const onSubmit = (searchQuery) => {
    _logger("search", searchQuery.locationSearch);
    weatherService
      .getSearchWeatherData(searchQuery.locationSearch)
      .then(onGetWeatherDataSuccess)
      .catch(onGetWeatherDataError);
  };
  return (
    <Col md={12} sm={8}>
      <Row>
        <WeatherDisplayCard weatherData={weatherData} />
      </Row>

      {showSearchBar && (
        <Formik
          initialValues={searchQuery}
          validationSchema={weatherSchema}
          onSubmit={onSubmit}
        >
          {({}) => (
            <Form>
              <Row className="mt-2 mx-auto">
                <Field
                  type="text"
                  name="locationSearch"
                  placeholder="Enter city/zip"
                  className="col-md-8"
                />

                <Col md={4} className="px-2">
                  <button type="submit" className="btn btn-primary">
                    Search
                  </button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      )}
    </Col>
  );
};

export default WeatherDisplay;
