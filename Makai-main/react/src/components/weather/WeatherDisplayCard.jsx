import React from "react";
import PropTypes from "prop-types";
import { Card, Row, Col } from "react-bootstrap";
import FalconCardHeader from "components/common/FalconCardHeader";
import CardDropdown from "components/common/CardDropdown";
import weatherIcon from "assets/img/icons/weather-icon.png";
import Flex from "components/common/Flex";

const WeatherDisplayCard = ({ weatherData }) => {
  return (
    <div>
      <Card className="card h-100">
        <FalconCardHeader
          title="Weather"
          light={false}
          titleTag="h6"
          className="pb-0"
          endEl={<CardDropdown />}
        />

        <Card.Body className="pt-2 text-align-right">
          <Row className="g-0 h-100 align-items-center">
            <Col as={Flex} alignItems="center">
              <img
                className="me-4"
                src={
                  weatherData?.weatherIcon
                    ? weatherData.weatherIcon
                    : weatherIcon
                }
                alt=""
                height="60"
              />
              <div>
                <h6 className="mb-2">
                  {weatherData?.city ? weatherData.city : ""}
                </h6>
                <div className="fs--2 fw-semi-bold">
                  <div className="text-warning">
                    {weatherData?.condition ? weatherData.condition : ""}
                  </div>
                  Precipitation:{"  "}
                  {weatherData?.precipitation ? weatherData.precipitation : "0"}
                  %
                </div>
                <div className="fs--2">
                  Wind:
                  {"  "}
                  {weatherData?.windSpeed ? weatherData.windSpeed : "0"} mph (
                  {weatherData?.windDirection ? weatherData.windDirection : "0"}
                  )
                </div>
              </div>
            </Col>
            <Col xs="auto" className="text-center ps-2">
              <div className="fs-4 fw-normal font-sans-serif text-primary mb-1 lh-1">
                {weatherData?.temperature ? `${weatherData.temperature}°` : ""}
              </div>
              <div className="fs--1 text-800">
                {weatherData?.highestTemperature &&
                weatherData?.lowestTemperature
                  ? `${weatherData.highestTemperature}° / ${weatherData.lowestTemperature}°`
                  : ""}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

WeatherDisplayCard.propTypes = {
  weatherData: PropTypes.shape({
    city: PropTypes.string.isRequired,
    condition: PropTypes.string.isRequired,
    weatherIcon: PropTypes.string.isRequired,
    precipitation: PropTypes.string.isRequired,
    temperature: PropTypes.number.isRequired,
    highestTemperature: PropTypes.number.isRequired,
    lowestTemperature: PropTypes.number.isRequired,
    windSpeed: PropTypes.number.isRequired,
    windDirection: PropTypes.string.isRequired,
  }).isRequired,
};

export default WeatherDisplayCard;
