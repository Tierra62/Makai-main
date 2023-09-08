// @flow
import React from "react";
import Chart from "react-apexcharts";
import { Container, Row } from "react-bootstrap";
import { number } from "yup";
import PropTypes from "prop-types";
import "../chatstatistics/chatstats.css";

const LineChartMeetings = ({ statistics, numberDays, optionSelected }) => {
  const allDays = statistics.stats?.allDates.map(daysMapper);

  function daysMapper(dayToMap) {
    const date = new Date(dayToMap);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return month + "/" + day + "/" + year;
  }

  const apexBarChartOpts = {
    chart: {
      height: 260,
      background: "#0b1727",
      type: "bar",
      stacked: true,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "35%",
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#0b1727", "#ffffff", "#ffffff"],
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    zoom: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    colors: ["#40afbb", "#0b1727"],
    xaxis: {
      categories: allDays,
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: "#ffffff",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val;
        },
        style: {
          colors: "#ffffff",
        },
      },
    },
    fill: {
      opacity: 1,
    },
  };

  const apexBarChartDataMeetings = [
    {
      name: "Meetings info per day",
      data: statistics?.stats?.allTotalMeets,
    },
  ];

  const apexBarChartDataParticipants = [
    {
      name: "Meetings info per day",
      data: statistics?.stats?.allTotalParticipants,
    },
  ];

  const apexBarChartDataDuration = [
    {
      name: "Meetings info per day",
      data: statistics?.stats?.allTotalDuration,
    },
  ];

  return (
    <>
      <Container className="mb-3">
        <Row className="mt-4">
          <p className="chatstats-details-title">
            Total Meetings Per Day (Last {numberDays} days)
          </p>
        </Row>
        <Row className="chatstats-chart-background">
          {optionSelected === "meetings" && (
            <Chart
              options={apexBarChartOpts}
              series={apexBarChartDataMeetings}
              type="bar"
              className="apex-charts"
              height={255}
            />
          )}
          {optionSelected === "participants" && (
            <Chart
              options={apexBarChartOpts}
              series={apexBarChartDataParticipants}
              type="bar"
              className="apex-charts"
              height={255}
            />
          )}
          {optionSelected === "minutes" && (
            <Chart
              options={apexBarChartOpts}
              series={apexBarChartDataDuration}
              type="bar"
              className="apex-charts"
              height={255}
            />
          )}
        </Row>
      </Container>
    </>
  );
};
LineChartMeetings.propTypes = {
  numberDays: PropTypes.number.isRequired,
  optionSelected: PropTypes.string.isRequired,
  statistics: PropTypes.shape({
    stats: PropTypes.shape({
      allTotalMeets: PropTypes.arrayOf(number).isRequired,
      allTotalDuration: PropTypes.arrayOf(number).isRequired,
      allTotalParticipants: PropTypes.arrayOf(number).isRequired,
      allDates: PropTypes.string.isRequired,
    }).isRequired,
  }),
}.isRequired;
export default LineChartMeetings;
